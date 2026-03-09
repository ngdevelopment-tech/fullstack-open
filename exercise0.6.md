sequenceDiagram
    participant browser
    participant server

    Note right of browser: The JS code adds the new note to the list and rerenders the notes on the page

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    server-->>browser: {"message":"note created"}
    deactivate server
    
    Note right of browser: The browser stays on the same page, no more requests