##Getting Started
Before getting started make sure you have: 

* Added your app in the My Applications section of the Color Dashboard. You need to do this so that you can get your App ID that you'll be adding to your app with our SDK.

##Adding Color TV Corona plugin

For a demo of the correct integration, please refer to our [Corona demo application](https://github.com/color-tv/corona-DemoApp)

### Using Color TV plugin

To use our plugin, simply require the `plugin.colortv` plugin in your main scene:

```
local colorTvSdk = require("plugin.colortv")
```

##Initializing the SDK

Setup the Color TV SDK for your app by invoking `colorTvSdk` initialization method in your code:

```
colorTvSdk.init("your_app_id_from_dashboard")
```

Your app id is generated in the publisher dashboard after adding or editing an application in the My Applications section. Copy the app id and paste the value for "your_app_id_from_dashboard".

##Displaying Ads

Ads may be shown wherever you place them inside your app, but they **must** include a Placement parameter to indicate the specific location. Placements are used to optimize user experience and analytics. 

###Placements
Below are all the possible placement values: 

- AppLaunch

- AppResume

- AppClose

- MainMenu

- Pause

- StageOpen

- StageComplete

- StageFailed

- LevelUp

- BetweenLevels

- StoreOpen

- InAppPurchase

- AbandonInAppPurchase

- VirtualGoodPurchased

- UserHighScore

- OutofGoods

- OutofEnergy

- InsufficientCurrency

- FinishedTutorial
 
!!! note ""
    You can choose what ad units you want to show for a specific placement in the dashboard, [click to learn more about Ad Units](index.md#ad-units)
    
To get callbacks about the ad status, you need to create an `adlistener` function that you'll pass to `loadAd` function:

```
local function adlistener(event)
    local name = event.name
    if (name == "adLoaded") then
        print("Ad has been loaded for placement: " .. event.placement)
        colorTvSdk.showAd(event.placement)
    elseif (name == "adClosed") then 
        print("Ad has been closed for placement: " .. event.placement)
    elseif (name == "error") then
        print("Error occured for placement: " .. event.placement .. ", with code " .. event.errorCode .. ": " .. event.errorMessage)
    elseif (name == "adExpired") then 
        print("Ad has expired for placement: " .. event.placement)
    end
end
```

To load an ad for a certain placement, you need to call the following method:

```
colorTvSdk.loadAd("adPlacement", adlistener)
```

Use one of the predefined placements that you can find in the list above, e.g. `AppResume`.

In order to show an ad, call the following function: 

```
colorTvSdk.showAd("adPlacement")
```

Calling this method will show an ad for the placement you pass. Make sure you get the `adLoaded` callback first, otherwise the ad won't be played.

!!! note ""
    It is recommended to set up multiple placements inside your app to maximize monetization and improve user experience.

##Earning Virtual Currency
A listener must be added in order to receive events when a virtual currency transaction has occurred. 

```
local function currencyListener (event)
    if (event.name == "currencyEarned") then
        local placement = event.placement
        local currencyType = event.currencyType
        local currencyAmount = event.currencyAmount
        print("Currency given for placement " .. placement .. ": " .. currencyAmount .. " x " .. currencyType)
    end
end

...
  
colorTvSdk.registerCurrencyEarnedListener(currencyListener)
```

###Currency for user

In order to distribute currency to the same user but on other device, use below:

```
colorTvSdk.setUserId("user123")
```

##User profile
 
To improve ad targeting you can use the user profile. You can set age, gender and some keywords as comma-separated values, eg. `sport,health` like so:

```
colorTvSdk.setUserAge(25)
colorTvSdk.setUserGender("male")
colorTvSdk.setUserKeywords("speed,cars")
```

These values will automatically be saved and attached to an ad request.

##Summary

After completing all previous steps your Lua script could look like this:

```
local colorTvSdk = require("plugin.colortv")

local function adlistener(event)
    local name = event.name
    if (name == "adLoaded") then
        print("Ad has been loaded for placement: " .. event.placement)
        colorTvSdk.showAd(event.placement)
    elseif (name == "adClosed") then 
        print("Ad has been closed for placement: " .. event.placement)
    elseif (name == "error") then
        print("Error occured for placement: " .. event.placement .. ", with code " .. event.errorCode .. ": " .. event.errorMessage)
    elseif (name == "adExpired") then 
        print("Ad has expired for placement: " .. event.placement)
    end
end

local function currencyListener (event)
    if (event.name == "currencyEarned") then
        local placement = event.placement
        local currencyType = event.currencyType
        local currencyAmount = event.currencyAmount
        print("Currency given for placement " .. placement .. ": " .. currencyAmount .. " x " .. currencyType)
    end
end

colorTvSdk.init("your_app_id_from_dashboard")
colorTvSdk.registerCurrencyEarnedListener(currencyListener)
colorTvSdk.loadAd("adPlacement", adlistener)
```
