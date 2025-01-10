local QBCore = exports['qb-core']:GetCoreObject()

local maxUnderwaterTime = 20.0
local currentUnderwaterTime = maxUnderwaterTime
local seatBelt = false
local isCarHudVisible = false

Citizen.CreateThread(function()
    local minimap = RequestScaleformMovie("minimap")
    SetRadarBigmapEnabled(true, false)
    Wait(0)
    SetRadarBigmapEnabled(false, false)

    while true do
        Wait(0)
        HideHudComponentThisFrame(6)
        HideHudComponentThisFrame(8)
        BeginScaleformMovieMethod(minimap, "SETUP_HEALTH_ARMOUR")
        ScaleformMovieMethodAddParamInt(3)
        EndScaleformMovieMethod()
    end
end)

Citizen.CreateThread(function()
    while true do
        Citizen.Wait(1000)

        local playerPed = PlayerPedId()
        local playerCoords = GetEntityCoords(playerPed) 
        local streetHash, crossingHash = GetStreetNameAtCoord(playerCoords.x, playerCoords.y, playerCoords.z) 
        local streetName = GetStreetNameFromHashKey(streetHash)

        SendNUIMessage({
            action = "updateHUD",
            location = streetName,
            coords = {
                x = playerCoords.x,
                y = playerCoords.y,
                z = playerCoords.z
            }
        })
    end
end)


Citizen.CreateThread(function()
    while true do
        Citizen.Wait(1000)

        local playerPed = PlayerPedId()
        local PlayerData = QBCore.Functions.GetPlayerData()
        local health = GetEntityHealth(playerPed)
        local maxHealth = GetEntityMaxHealth(playerPed)
        local armourLevel = GetPedArmour(playerPed)

        if IsPedSwimmingUnderWater(playerPed) then
            currentUnderwaterTime = math.max(0, currentUnderwaterTime - 1)
        else
            currentUnderwaterTime = math.min(currentUnderwaterTime + 1, maxUnderwaterTime)
        end

        local oxygenLevel = math.floor((currentUnderwaterTime / maxUnderwaterTime) * 100)

        if PlayerData and PlayerData.metadata then
            local hungerLevel = math.floor(PlayerData.metadata["hunger"] or 100)
            local thirstLevel = math.floor(PlayerData.metadata["thirst"] or 100)

            SendNUIMessage({
                action = "updateHUD",
                hp = math.floor((health / maxHealth) * 100),
                food = hungerLevel,
                water = thirstLevel,
                oxygen = oxygenLevel,
                armour = armourLevel,
            })
        end
    end
end)

Citizen.CreateThread(function()
    local seatBelt = false
    while true do
        Citizen.Wait(10)

        local playerPed = PlayerPedId()
        local vehicle = GetVehiclePedIsIn(playerPed, false)
        
        if vehicle ~= 0 then
            local speed = Config.mph and math.floor(GetEntitySpeed(vehicle) * 2.23694) or math.floor(GetEntitySpeed(vehicle) * 3.6)
            local rpm = GetVehicleCurrentRpm(vehicle)
            local maxRpm = 1.0
            local petrolLevel = GetVehicleFuelLevel(vehicle)
            local engineHealth = GetVehicleEngineHealth(vehicle)

            if IsControlJustPressed(0, Config.seatBeltKey) then
                seatBelt = not seatBelt
            end

            SendNUIMessage({
                action = "updateHUD",
                speed = speed,
                rpm = rpm,
                maxRpm = maxRpm,
                engine = engineHealth,
                petrol = petrolLevel,
                seatBelt = seatBelt,
                isMph = Config.mph
            })
        else
            SendNUIMessage({
                action = "hideHUD"
            })
        end
    end
end)
