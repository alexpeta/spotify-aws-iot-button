# AWS iOT Spotify Button

[![CircleCI](https://circleci.com/gh/alexpeta/spotify-aws-iot-button.svg?style=svg)](https://circleci.com/gh/alexpeta/spotify-aws-iot-button)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Motivation
AWS iOT Spotify Button is a simple Express.js Node app that connects with Spotify's Track API and Playback API's.
It is part of a solution that lets an AWS IoT button control the users playbback options.
It has three features :
- Next track (single press)
- Previous track (double press)
- Pause (long press)

## Flow Diagram
![Flow Diagram](https://i.imgur.com/r7qEq3R.png "Flow Diagram")

## Prerequisites


## 🎵 Spotify API 🎵
The full Spotify reference : https://developer.spotify.com/documentation/web-api/reference-beta/

Testing pages:
- Next track: https://developer.spotify.com/console/post-next/
- Previous track: https://developer.spotify.com/console/post-previous/
- Pause track: https://developer.spotify.com/console/put-pause/

Authorization guide:
- https://developer.spotify.com/documentation/general/guides/authorization-guide/
