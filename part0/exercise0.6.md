
```mermaid
sequenceDiagram
    participant browser
    participant server

    Note right of browser: User clicks Save. JavaScript code adds note to local list and rerenders it.

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    Note left of server: Server saves note and returns 201 Created
    server-->>browser: {"message":"note created"}
    deactivate server

    Note right of browser: The page does not reload. No further requests.
