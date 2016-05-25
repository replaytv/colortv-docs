##Getting started

The ColorTV Corona Plugin is a light-weight plugin to provide functionality of the ColorTV SDK with Corona apps.

Before getting started make sure you have: 

* Added your app in the My Applications section of the Color Dashboard. You need to do this so that you can get your App ID that you'll be adding to your app with our SDK.

###Integrating the plugin to your game

To start using ColorTV Corona Plugin you have to declare a local variable with the `require` function:

```
local colorTvSdk = require("plugin.colortv")
```

Then you need to call the `colorTvSdk.init("appId")` function, preferably in your game's first scene's `scene:show()` function:

```
function scene:show( event )
    local phase = event.phase

    if ( phase == "did" ) then
        colorTvSdk.init("appId")
    end
end
```

You can also enable debug mode to receive more verbose logging from the SDK by calling:

```
colorTvSdk.setDebugMode(true)
```

To get callbacks about the ad status, you need to create the following listener:

```
local function adlistener(event)
    local name = event.name
    if (name == "adLoaded") then 
        print("Ad has been closed for placement: " .. event.placement)
    elseif (name == "adClosed") then 
        print("Ad has been closed for placement: " .. event.placement)
    elseif (name == "error") then
        print("Error occured for placement: " .. event.placement .. ", with code " .. event.errorCode .. ": " .. event.errorMessage)
    end
end
```

Then you need to register the listener by using the `colorTvSdk` object:

```
colorTvSdk.registerAdListener(adlistener)
```

To load an ad for a certain placement, you need to call the following function:

```
colorTvSdk.loadAd("AppLaunch")
```

Where `AppLaunch` is the desired placement.

It is recommended that you use one of the predefined placements that you can find in the [main documentation file](index.md#placements). You can also use a custom placement.

To show an ad for a certain placement, you need to call the following function:

```
colorTvSdk.showAd("AppLaunch")
```

Calling this function will show an ad for the placement you pass. Make sure you get the `adLoaded` callback first, otherwise the ad won't be ready to be played.

###Registering currency earned listener

In order to reward the user, you have to create a listener function in:

```
local function currencyListener (event)
    if (event.name == "currencyEarned") then
        local placement = event.placement
        local currencyType = event.currencyType
        local currencyAmount = event.currencyAmount
        print("Currency given for placement " .. placement .. ": " .. currencyAmount .. " x " .. currencyType)
    end
end
```

And then register the listener by calling:

```
colorTvSdk.registerCurrencyEarnedListener(currencyListener)
```

Now you will be notified when the user earns virtual currency.

###Currency for user

In order to distribute currency to the same user but on other device, use below:

```
colorTvSdk.setUserId("user123")
```

##User profile
 
To improve ad targeting you can use functions that set the user profile.

You can set age, gender and some keywords as comma-separated values, eg. `sport,health` like so:

```
colorTvSdk.setUserAge(25)
colorTvSdk.setUserGender("female")
colorTvSdk.setUserKeywords("sport,health")
```

These values will automatically be saved and attached to an ad request.
