# PNHelper
PNHelper  is a browser extension to enhance pagination navigation efficiency, which automatically recognizes(or allows geeks to point out) navigation components for various of websites and provides a shortcut(Alt+WheelLeft/WheelRight, or Alt+SwipeLeft/SwipeRight) for visitors to navigate to prev/next page quickly.

## Features and Roadmap

### 0.1
+ [x] Preset pagination component rules for some websites

### 0.2
+ [x] Provide a settings page for user to add/delete user-defined rules

### 0.3
+ [ ] Allow users to update built-in rules from an online update site

### 1.0
+ [ ] Make PNHelper intelligently recognize navigation components for various of websites

## Installation
1. Download PNHelper, e.g. "PNHelper-x.y.z.crx", or checkout this repository
2. Rename "PNHelper-x.y.z.crx" to "PNHelper-x.y.z.zip", unzip it to a new folder "PNHelper-x.y.z"
3. Open chrome, navigate to [chrome://extensions/](Chrome Extensions) page, at Chrome Extensions page
  1. Check "Developers Mode"
  2. Click "Load unpacked extension" and select the path to PNHelper-x.y.z. alternately, you can just drag the folder "PNHelper-x.y.z" then drop it to Chrome Extensions page
  3. If a new 'PN' icon appears on the top-right corner of Chrome window, then you may say: PNHelper have been installed successfully.

## Settings
1. Right click on PNHelper icon, select 'Options'
  1. Ro add a new rule, input the host, CSS query selectors to get prev/next link/button, then click 'Add'.
  2. Ro delete a rule, click "Delete" on specified host rule row.

## Usage
1. Visit a PNHelper-ready website(see options page of PNHelper), navigation to a page with pagination, e.g. https://www.google.com.ar/search?q=hi+there, press Alt and wheel left/right, or press Alt and swipe left/right.
2. If page jumps away, then you got it.
