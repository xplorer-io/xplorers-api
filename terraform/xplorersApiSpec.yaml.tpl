swagger: "2.0"
info:
  title: XPLORERS API
  description: Xplorers API - backend for Xplorers Website and other tasks
  version: 1.0.0
schemes:
  - https
produces:
  - application/json
host: ${api_endpoint_service}
x-google-backend:
  address: ${cloud_run_url}
paths:
  /slack/user:
    get:
      description: Fetch a slack user by slack id, name or email
      operationId: fetchSlackUser
      security:
        - XplorersAPIKey: []
      parameters:
        - name: userEmail
          in: query
          description: email of the user to fetch Slack info for
          required: false
          type: string
        - name: userName
          in: query
          description: name of the user to fetch Slack info for
          required: false
          type: string
        - name: userId
          in: query
          description: id of the user to fetch Slack info
          required: false
          type: string
      responses:
        200:
          description: Successful response
          schema:
            $ref: "#/definitions/SlackUser"
        404:
          description: User not found
        500:
          description: Internal server error
  /slack/user/status:
    get:
      description: Fetch a slack user status by email
      operationId: fetchSlackUserStatusByEmail
      security:
        - XplorersAPIKey: []
      parameters:
        - name: userEmail
          in: query
          description: email of the user to validate in Slack
          required: true
          type: string
      responses:
        200:
          description: Successful response
          schema:
            $ref: "#/definitions/SlackUserStatus"
        404:
          description: User not found
        500:
          description: Internal server error
definitions:
  SlackUser:
    type: object
    properties:
      id:
        type: string
      first_name:
        type: string
      last_name:
        type: string
      title:
        type: string
      email:
        type: string
  SlackUserStatus:
    type: object
    properties:
      isActive:
        type: boolean
securityDefinitions:
    XplorersAPIKey:
      type: apiKey
      in: header
      name: x-api-key
x-google-endpoints:
  - name: ${api_endpoint_service}
    allowCors: true
