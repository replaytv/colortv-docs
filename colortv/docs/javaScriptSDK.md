##Getting Started
Before getting started make sure you have: 

* Added your app in the My Applications section of the Color Dashboard. You need to do this so that you can get your App ID that you'll be adding to your app with our SDK.

##Initializing the SDK

Import the `colortvSDK.js` file to your html or module loader:

```javaScript
<script src="path/to/your/folder/colortvSDK.js"><script/>
```

Setup the ColorTvSDK for your app by invoking `ColorTvSdk` initialization method below in your code. ColorAdSdk is 

```javaScript
var color = ColorAdSdk.getInstance();
color.setConfig({
            node: <html_node_element>,
            appId: <your_app_id_from_dashboard>
        });
```

Your app id is generated in the publisher dashboard after adding or editing an application in the My Applications section. Copy the app id and paste the value for "your_app_id_from_dashboard".
Also You have to provide html node element ( for example from jQuery) that we will append our SDK to.
!!! note ""
    Node element passed to config object has to be first element under <body> tag.

##Displaying Ads

Ads will be shown in DOM element that You will provide us. Placements are used to optimize user experience and analytics. 

###Placements
You can find placements constants in
```javaScript
ColorAdSdk.Placements
```
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
    

To load an ad for a certain placement, you need to call the following method:

```javaScript
color.loadAd(placement,callback);
```

Use one of the predefined placements that you can find in Color class, e.g. `Color.Placements.LEVEL_UP`. </br>
Function loadAd returns Promise which you can use for same purpose.
```javaScript
color.loadAd(placement).then(function (){
    <YOUR CODE>
);
```
Beside this loadAd fires event that You can listen to. We provide You Color.EventManager.on(event,callback) which takes 
one of events that You can find in Color.Events, and as second argument it takes callback function.
```javaScript
color.loadAd(placement);
ColorAdSdk.EventManager.on(Color.Events.AD_LOADED,function(){
      <YOUR CODE>
);
```
 <!--returns promise whenever it's ready to show ads. -->
```javaScript
color.loadAd(<Placement>).then(function(){
    <Code after ad loaded>
);
```


In order to show an ad, call the following function: 

```java
color.showAd(placement);
```


Calling this method will show an ad for the placement you pass. Make sure you the `loadAd` function returned, otherwise the ad won't be played.