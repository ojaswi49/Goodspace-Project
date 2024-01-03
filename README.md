# Goodspace Communications

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [User Registration](#user-registration)
   - [Login](#login)
3. [Profile Page](#profile-page)
   - [Chatbox](#chatbox)
   - [Speech Synthesis](#speech-synthesis)
   - [Speech Recognition](#speech-recognition)
   - [Webcam and Microphone](#webcam-and-microphone)
4. [Troubleshooting](#troubleshooting)
   - [Common Issues](#common-issues)

## Introduction

Welcome to the official documentation for Goodspace Communications, your platform for seamless communication! This guide will help you understand the features and functionalities of our application.

## Getting Started

### Prerequisites

Make sure you have the following prerequisites installed:

- [Node.js]
- [React.js] (version x.x.x)
- [Socket.io](for real-time communication)
- [MongoDB](for database storage)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/goodspace-communications.git

2. Navigate to the project directory:

  ```
    cd goodspace-communications
```
3. Install Dependencies

     a.  ``` cd project_frontend
        ```
         ``` npm install --legacy-peer-deps
        ```
     b.  ``` cd project_backend
       ```
         ``` npm install
        ```

4. Run Locally
    a. ```node index```
    b. ```npm run start```

# Goodspace Communications

## User Registration

To use the application, users must register. Follow these steps:

1. Open the application and click on the "Sign Up" button.
2. Enter your name, username, and password.
3. Click "Sign up" to complete the registration process.

## Login

After registration, follow these steps to log in:

1. Click on the "Login" button.
2. Enter your username and password.
3. Click "Log In" to access your profile.

## Profile Page

### Chatbox

The chatbox is a central feature of Goodspace Communications, enabling real-time communication users and the AI Chat-GPT. Here's how it works:

- **Sending Messages:**
  - Type your message in the input field.
  - Press "Send" button to send the message.

- **Speech Synthesis:**
  - Click on the "Audio" play button to enable speech synthesis.
  - The system will read out the latest message on the click of the play button.

- **Speech Recognition:**
  - Click on the microphone icon to enable speech recognition.
  - Speak a message, and it will be sent as a text message.

### Webcam and Microphone

Enhance your communication experience with video and audio features:

- **Toggle Webcam:**
  - Click on the camera icon to turn your webcam on/off.

- **Audio Playback:**
  - Click on the "Audio" button to play the latest message.

## Troubleshooting

### Common Issues

- **Login Issues:**
  - If you encounter login issues, ensure your username and password are correct.

- **Chatbox Not Loading:**
  - Check your internet connection.
  - Ensure the WebSocket server is running.




