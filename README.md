# EveryoneRunning-Backend


## Directory Structure
### /src
Source code of the project. <br>
* `main.js` : RESTful API Reqest Handler
* `object.js`: Object definition of each *object*, such as *member*, *mission* etc.

### Start the server (temporarily)
1. Go to EECS822.
2. ssh NAS with your account.
3. type `node ../howard19192828/RunRRR-Backend/src/main.js` in terminal.
4. Console prints out `[INFO] Success when connecting to db` as starting the server successfully.

### API URL (temporarily)
Call the API with URL when you're at EECS822. <br>
URL : `192.168.0.2:8081/api/v1/object/action`

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
                            "class": 0,
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
                            "class": 0,
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
                            "class": 1,
                            "score": 10
                        }
        ]
  }
}
```




