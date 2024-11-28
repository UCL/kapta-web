# Kapta Web

## What?

Kapta Web is a platform for searching WhatsApp Maps and tasking WhatsApp Mappers

👉 https://kapta.earth

## Why?

To connect users and producers of ground information. See our latest blog and where this started in 2010:

- [WhatsApp Maps? Connecting users and producers of ground information](https://uclexcites.blog/2024/06/26/whatsapp-maps-connecting-users-and-producers-of-ground-information/)
- [Extreme Citizen Science in the Congo rainforest](https://www.youtube.com/watch?v=IgQc7GQ1m_Y)

## What's next?

Kapta AI: The first WhatsApp Maps Assistant for creating and searching WhatsApp Maps

## Who?

Kapta is being developed by the [University College London (UCL)](http://ucl.ac.uk) [Extreme Citizen Science (ExCiteS) research group](http://ucl.ac.uk/excites) and the [Advanced Research Computing Centre (UCL ARC)](https://www.ucl.ac.uk/advanced-research-computing), with help from outside partners & contributors.

Currently the core Kapta team consists of:

- [Marcos Moreu](https://www.ucl.ac.uk/geography/people/research-staff/marcos-moreu), UCL Geography
- [Fabien Moustard](https://www.ucl.ac.uk/geography/fabien-moustard), UCL Geography
- [Tom Couch](https://www.ucl.ac.uk/advanced-research-computing/people/tom-couch), UCL ARC
- [Amanda Ho-Lyn](https://www.ucl.ac.uk/advanced-research-computing/research-software-engineers-0), UCL ARC
- [Muki Haklay](https://www.ucl.ac.uk/geography/muki-haklay-facss), UCL Geography
- [Claire Ellul](https://www.ucl.ac.uk/civil-environmental-geomatic-engineering/people/dr-claire-ellul), UCL CEGE
- [Jerome Lewis](https://www.ucl.ac.uk/anthropology/people/academic-and-teaching-staff/jerome-lewis), UCL Anthropology
- [Jonathan Cooper](https://www.ucl.ac.uk/advanced-research-computing/people/jonathan-cooper), UCL ARC
- [Jed Stevenson](https://www.durham.ac.uk/staff/jed-stevenson/), Durham University
- [Dessalegn Teckle](https://et.linkedin.com/in/dessalegn-tekle-02b848ba), Addis Ababa University, NGO IPC
- [Igor Tseyzer](https://profiles.ucl.ac.uk/98596-igor-tseyzer), UCL ARC
- [Socrates Varakliotis](https://profiles.ucl.ac.uk/11085-socrates-varakliotis), UCL ARC


# Guidance for Developers

## Requirements

- Node.js v20.0.0 or later
- npm v10.0.0 or later
- mapbox API key (create an account at https://www.mapbox.com/)

## Installation

1. Clone the repository: `git clone https://github.com/UCL/kapta-web.git && cd kapta-web`
2. Run `npm install` in the root directory
3. Create config file (see below)
4. Run `npm run build` to build the project
5. Run `npm start` to start the development server
6. Open `http://localhost:8080` in your browser

## Configuration

<!-- need to update to make relevant to env vars -->
<!-- something like Kapta requires certain environment variables to work, look in globals.js to see what they're called -->

Kapta requires a configuration file to be created in the src directory. The file should be named `config.json` and should contain the following fields:

```json
{
	"mapbox": {
		"accessToken": "YOUR_MAPBOX_ACCESS_TOKEN"
	},
	"api": {
		"invokeUrl": "" // API URL (optional)
	},
	"kapta": {
		"askTheTeamURL": "" // URL for user support e.g. WhatsApp business chat URL (optional)
	}
}
```

# Legal disclaimer

Copyright © 2024 [University College London](http://ucl.ac.uk)

Licensed under the **Apache License, Version 2.0** (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
