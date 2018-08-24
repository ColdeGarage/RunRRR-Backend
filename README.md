# EveryoneRunning-Backend

## Installation
### 前置工作
* Google Map Boundary File `(boundary.kml)`
* Environment Values File `(.env)`
* Check Directory Structure
```
├── Dockerfile
├── package.json
├── README.md
├── data
│   ├── img
│   └── map
│       └── boundary.kml
├── src
│   ├── clue.js
│   ├── config_production.json
│   ├── config_staging.json
│   ├── db.js
│   ├── main.js
│   ├── member.js
│   ├── mission.js
│   ├── pack.js
│   ├── report.js
│   └── tool.js
└── server-log
```
## Develop
### Install Depencency
```bash
path_to_project $ npm install
```
### Running Unit test
Setup `./src/config_staging.json`
```bash
path_to_project $ npm test
```
## Deployment
### Start server
Setup `./src/config_production.json`

```bash
git clone https://github.com/ColdeGarage/RunRRR-Backend.git
cd RunRRR
npm install
npm start
```

### Deploy as docker
```bash
docker build -t runrrr-backend .
docker run runrrr-backend
```



## Directory Structure
### /src
Source code of the project. <br>
* `main.js` : RESTful API Reqest Handler
* `object.js`: Object definition of each *object*, such as *member*, *mission* etc.

### /data
Image and other related data used in game. <br>
* `img/` : Mission Report photo images, Tools images, etc.
* `map/boundary.kml` : Google Map Boundary File

### /server-log
Dumped logs while backend-server is running.

### API URL (temporarily)
Call the API with URL when you're at EECS822. <br>
URL : `OURPATH/api/v1/object/action`

## API Return Template
The API will return in JSON format.
Every return JSON should include the following 4 entries.<br>
* `uid`: The unique id of target user
* `object`: Object type of target object, which is same as api path
* `action`: Action to the target object, which is same as api path
* `brea`: Status code, 0 is correct.

An alternative payload is sent back if there's some query information.
* `payload`: The return information of target object

In some read api, if not designate id, it will return a list of items.

### Payload foramt
There are always 2 entries in payload.
* `type`: Type of payload, either `Attribute Name` or `Objects`
* *`attribute name`*: Value of corresponding *`attribute name`*, where *`attribute name`* can be `status`,  `mid`, `tid` etc. **Only exists when `type` be `Attribute Name`**.
* `Objects`: Whole objects attributes key/value pair.

### Examples
#### No payload return 
Return JSON of  `/api/v1/member/callhelp` 
```JSON
{ 
  "uid": 86,
  "object": "member",
  "action": "callhelp",
  "brea": 0
}
```

#### Single value payload return
Return JSON of  `/api/v1/report/create` 
```JSON
{ 
  "uid": 34,
  "object": "report",
  "action": "create",
  "brea": 0,
  "payload":{
        "type": "Attribute Name",
        "rid": 16
  }
}
```

#### Object payload return
Return JSON of  `/api/v1/mission/read`(requesting mid 12) 
```JSON
{ 
  "uid": 34,
  "object": "report",
  "action": "create",
  "brea": 0,
  "payload":{
        "type": "Objects",
        "objects": [
                        {
                            "mid": 12,
                            "title": "證人救出",
                            "content": "證人Jacky快要被黑暗組織逮捕啦!! 快去湖心亭將Jacky帶回總部 blah blah blah",
                            "time_start": "14:03",
                            "time_end": "14:23",
                            "price": 1500,
                            "clue": 8,
                            "class": "MAIN",
                            "score": 20,
                            "location_e": 120.995106,
                            "location_n": 24.794090
                        }
        ]
  }     
}
```

#### Object list payload return
Return JSON of  `/api/v1/mission/read` (No designate mid
```JSON
{ 
  "uid": 34,
  "object": "report",
  "action": "create",
  "brea": 0,
  "payload":{
        "type": "Objects",
        "objects": [
                        {
                            "mid": 12,
                            "title": "證人救出",
                            "content": "證人Jacky快要被黑暗組織逮捕啦!! 快去湖心亭將Jacky帶回總部 blah blah blah",
                            "time_start": "14:03",
                            "time_end": "14:23",
                            "price": 1500,
                            "clue": 8,
                            "class": "MAIN",
                            "score": 20,
                            "location_e": 120.995106,
                            "location_n": 24.794090
                        },
                        {
                            "mid": 15,
                            "title": "抓住證人",
                            "content": "證人Jacky發瘋了! 找到他將他制伏",
                            "time_start": "14:15",
                            "time_end": "14:30",
                            "price": 1100,
                            "clue": 10,
                            "class": "SUB",
                            "score": 10,
                            "location_e": 0,
                            "location_n": 0
                        }
        ]
  }
}
```




