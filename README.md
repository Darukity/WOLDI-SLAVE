# How to Launch the Program

## Using Docker

1. **Build the Docker Image**:
    Open a terminal and navigate to the directory containing the `Dockerfile`. Run the following command to build the Docker image:
    ```sh
    docker build -t my-node-app .
    ```

2. **Run the Docker Container**:
    Use the following command to run the Docker container. This command maps port 3001 on your host to port 3000 in the container and sets the necessary environment variables:
    ```sh
    docker run -d -p 3001:3000 -e TOKEN=<Your token> -e CLIENT_ID=<bots client id> -e GUILD_ID=<id of your server> my-node-app
    ```
    You can replace 3001 with whatever port is avalilable if you want to handle many slaves at the same time.

## Without Docker

1. **Install Node.js**:
    Ensure you have Node.js installed on your machine. You can download it from [Node.js official website](https://nodejs.org/).

2. **Set Up Environment Variables**:
    Create a `.env` file in the root directory of your project with the following content:
    ```properties
    TOKEN=<Your token>
    CLIENT_ID=<bots client id>
    GUILD_ID=<id of your server>
    ```

3. **Install Dependencies**:
    Open a terminal, navigate to your project directory, and run the following command to install the necessary dependencies:
    ```sh
    npm install
    ```

4. **Run the Application**:
    Start the application by running:
    ```sh
    node slave.js
    ```


    ## WebSocket Endpoints

    The application uses WebSocket to handle real-time communication. Below are the available WebSocket endpoints:

    1. **Set Status Text**:
        - **Event Name**: `setStatusText`
        - **Description**: Updates the bot's status text.
        - **Payload**:
            ```json
            {
                "statusText": "New status text"
            }
            ```

    2. **Set Status Type**:
        - **Event Name**: `setStatusType`
        - **Description**: Updates the bot's status type (e.g., Playing, Streaming).
        - **Payload**:
            ```json
            {
                "statusType": "Playing"
            }
            ```

    3. **Set Presence Status**:
        - **Event Name**: `setPresenceStatus`
        - **Description**: Updates the bot's presence status (e.g., online, idle).
        - **Payload**:
            ```json
            {
                "status": "online"
            }
            ```

    4. **New Status**:
        - **Event Name**: `newStatus`
        - **Description**: Updates both the bot's status text and type.
        - **Payload**:
            ```json
            {
                "statusText": "New status text",
                "statusType": "Playing"
            }
            ```
