FNAME = "***REMOVED***"
LNAME = "***REMOVED***"
CWID = ***REMOVED***

DEFAULT_START_SCRIPT = 'node index.js'
NAME_REGEX = r'^cs-546-lab-\d$'
FOLDER_NAME = 'cs-546-lab-'
SECTION = 'WS'

def get_package_json(module_name):
    return {
        'name':module_name,
        'version':'1.0.0',
        'description':f'CS 546{SECTION} - Stevens Institute of Technology - Fall 2021',
        'main':'index.js',
        'scripts':{
            'start':'node index.js',
            'test':'echo "NOTIMPLEMENTED"',
        },
        'repository':{
            'type':'git',
            'url':'git+https://github.com/PMARINA/CS546-HW.git'
        },
        'author':f'{FNAME} {LNAME} {CWID}',
        'license':'ISC',
        'bugs':{
            'url':'https://github.com/PMARINA/CS546-HW/issues'
        },
        'homepage':'https://github.com/PMARINA/CS546-HW#readme'
    }