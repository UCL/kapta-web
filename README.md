# Kapta

Kapta is a platform that brings people together to create and share WhatsApp Maps

👉 https://kapta.earth

# Guidance for Developers
- [Kapta Mobile repository](https://github.com/UCL/kapta-mobile)
- [Kapta Infrastructure repository](https://github.com/UCL/kapta-infrastructure)
  
## Requirements

- Node.js v20.0.0 or later
- npm v10.0.0 or later
- mapbox API key (create an account at https://www.mapbox.com/)

## Installation

1. Clone the repository: `git clone https://github.com/UCL/kapta-web.git && cd kapta-web`
2. Run `npm install` in the root directory
3. Create .env file (see below)
4. Run `npm run build` to build the project
5. Run `npm run dev` to start the development server
6. Open `http://localhost:5173` in your browser

## Configuration

<!-- need to update to make relevant to env vars -->
<!-- something like Kapta requires certain environment variables to work, look in globals.js to see what they're called -->

Kapta requires a configuration file to be created in the root directory. The file should be named `.env` and should contain the following fields do not put quotes or spaces around the values:

```
VITE_REQUEST_URL=
VITE_WEB_POOL_ID=
VITE_CLIENT_ID=
VITE_REGION=
VITE_MAPBOX_TOKEN=
```

# Legal disclaimer

Copyright 2024 Wisdom of the Crowd Labs (WCL)

Licensed under the **Apache License, Version 2.0** (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
