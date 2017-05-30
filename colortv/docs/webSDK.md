## Getting Started

### *IT'S NOT PRODUCTION READY*
To use the ColorTV SDK you first need to create an instance of the `ColorWebSDK` class. This instance will be used to control everything: showing and hiding recommendations, tracking clicks, and listening to SDK events.

```javascript
new ColorWebSDK(sdkParams)
```

## Compatibility - Mobile

Browser | Version | Support 
 --- | --- | :---: 
Safari | 10 | 👍 
Chrome | 58 | 👍 
Firefox | 7.5 | 👍 


## Usage

First you need to download the SDK from [here](https://s3.amazonaws.com/color-web-sdk/web/color-web-sdk.0.1.1-beta.3.js). The SDK comes with both CSS and JS components. The CSS file is obviously an optional include but will give you decent styling out of the box. The SDK includes components for both getting/showing recommendations as well as tracking the users engagement.

To include the into your page or app you will need to add these HTML tags to the `<head>` of your page.

```html
<script type="text/javascript" src="https://s3.amazonaws.com/color-web-sdk/web/color-web-sdk.0.1.1-beta.5.js"></script>
<link rel="stylesheet" href="https://s3.amazonaws.com/color-web-sdk/web/color-web-sdk.0.1.1-beta.5.css"></link>
```

## Arguments

```javascript
var sdkParams = {
   appId: 'APP_ID', // *(String)*: The ID of your app that can be acquired through the ColorTV dashboard
   partnerVideoId: 'VIDEO_ID', // *(String)*: This optional argument is used to get recommendations. When supplied the recommendations will be relevant to this video. If it is not supplied then the recommendations will be generated based on your app alone.
   element: document.querySelector('.rootElement'), // *(DOMNode)*: The `DOMNode` which we will mount the recommendation container to. This is an optional argument, if you do not supply it then we will mount to the body of the page. If you do supply it be careful about parent elements positioning (as described [here](#colorwebsdkshowrecommendations))
   callbacks: { // *(Object)*: Callbacks for when events happen within the instance of the sdk
      onSessionInit: function(session) {}, // *(Function)*: Called when the session is initialized for the first time. It receives the session object with `sessionId`, `state`,
      onSessionUpdate: function(){}, // *(Function)*: Called when the session is updated. This will happen automatically and you will not need to worry about keeping the session alive.
      onRecommendationsLoaded: function(){}, // *(Function)*: Called when the recommendations are loaded from the server. It receives a list of recommendation objects.
      onRecommendationsClose: function(){}, // *(Function)*: Called when the recommendations are shown to the user
      onRecommendationsShow: function(){}, // *(Function)*: Called when the user clicks the close button in the recommendation container. It takes no arguments
      onScrollToFinished: function(){} // *(Function)*: Called when a new video gets scrolled to automatically by the SDK. It takes no arguments
   }
}
```

### Returns

An instance of the ColorWebSDK. This instance is used to get and display recommendations.

### Examples
```javascript
 var sdkInstance = new ColorWebSDK({
   appId: 'APP_ID',
   partnerVideoId: 'VIDEO_ID',
   element: document.querySelector('.rootElement')
   callbacks: {
     onSessionInit: function(session) { console.log(session) },
     onSessionUpdate: function(){},
     onRecommendationsLoaded: function(){},
     onRecommendationsClose: function(){},
     onRecommendationsShow: function(){},
     onScrollToFinished: function(){},
   }
 })
```

## Get Recommendations
```javascript
sdkInstance.getRecommendations()
```
Gets the recommendations from the server.

### Returns
A promise that will be resolved when the recommendations have been returned from the server.

### Examples

```javascript
 sdkInstance
   .getRecommendations()
   .then(() => sdkInstance.showRecommendations())
   .catch((err) => { throw new Error(err) })
```

## Show Recommendations
```javascript
sdkInstance.showRecommendations()
```

The function used to show the recommendations container to the user. Take care to only call this function once `getRecommendations()` has been called and returned successfully. Otherwise the recommendation container will not be rendered and a error will be thrown. This function doesn't take any arguments, and doesn't return anything either.

> Note: It creates a container with `position: absolute; top: 0px; left: 0px;`, so it is worthwhile being cautious about the what `DOMNode` you are passing into the constructor. If any of the parents elements are set to `position: absolute;` or `position: relative;` then you could run into issues with the scrolling auto-play feature not working or the container appearing in the wrong location.


## Hide Recommendations
```javascript
sdkInstance.hideRecommendations()
```

Hide recommendations closes the recommendation container. The user can also trigger this by clicking the close button in the top left corner of the container.

## Stroll To Recommendations

```javascript
sdkInstance.scrollToFirstRecommendation()
```

As suggested this function scrolls to the first recommendation in the container. You shouldn't need to call it, but in some cases when the event that fires `showRecommendations()` happens after some scrolling then it may be neccessary.

### Examples
```javascript
var sdk = new ColorWebSDK({
  appId: 'APP_ID',
  callbacks: {
    onRecommendationsShow: scrollToFirst
  }
})

function scrollToFirst(){
  sdk.scrollToFirstRecommendation()
}
```

## Click Tracking

To track users clicks and recommendations you need to call various functions in our SDK. To do this there is a child object of `ColorWebSDK` called `tracking` which has all of the functions to call when an event occurs. It is worth noting that you only need to do this for the first video that the user watches; we will track all events that occur within the recommendation container.

### ColorWebSDK.tracking.onStart(positionSeconds)

A function that is to be called when the user starts the video.

#### Arguments
`positionSeconds` *(Number)*: The position of the video in seconds.

### ColorWebSDK.tracking.onResume(positionSeconds)

A function that is to be called when the user resumes the video. There is a difference between the `onStart` and `onResume` events, even though both of these events can occur at any point during the video. The first `video.onplay` should be tracked as `onStart` where the second and all subsequent `onplay` events should be `onResume`.

#### Arguments
`positionSeconds` *(Number)*: The position of the video in seconds.

### ColorWebSDK.tracking.onPause(positionSeconds)

A function that is to be called when the user pauses the video.

#### Arguments
`positionSeconds` *(Number)*: The position of the video in seconds.

### ColorWebSDK.tracking.onStop(positionSeconds)

A function that is to be called when the user stops the video. The general case for stopping the video will be when the page gets closed. In most scenarios only `onPause` will be called.

#### Arguments
`positionSeconds` *(Number)*: The position of the video in seconds.

### ColorWebSDK.tracking.onComplete(positionSeconds)

A function that is to be called when the video completes.

#### Arguments
`positionSeconds` *(Number)*: The position of the video in seconds.

### Examples

This implementation would only show the recommendation container when the user has completed the video and not `onpause`.

```javascript
var video = document.querySelector('#video_id video')

var sdk = new ColorWebSDK({
  appId: 'APP_ID'
})

var onPlay = function (e) {
  // TRACKING
  if (!video.hasStarted) {
    video.hasStarted = true
    return sdk.tracking.onStart(e.target.currentTime)
  }
  sdk.tracking.onResume(e.target.currentTime)
}
var onPause = function (e) {
  // TRACKING
  sdk.tracking.onPause(e.target.currentTime)
}
var onComplete = function (e) {
  // RECOMMENDATIONS
  sdk
    .getRecommendations()
    .then(() => sdk.showRecommendations())
    .catch((err) => { throw new Error(err) })
  // TRACKING
  sdk.tracking.onComplete(e.target.currentTime)
}

video.onplay = onPlay
video.onpause = onPause
video.onended = onComplete
```
