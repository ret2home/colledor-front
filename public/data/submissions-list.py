import requests
import json
from threading import Thread

token="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6ImFkbWluIiwiZXhwIjoxNjU3MzU0MjAzfQ.6TGawpp3T1YKGMFiaDAw1E_gcFJFww7lsBqheFhvuV8"

def f():
    data={
        "token":token,
        "user":"all"
    }
    url="https://colledor-api.tk/submissions-list"
    res=requests.post(url,json=data).json()
    with open(f"./submissions-list.json","w")as f:
        json.dump(res,f,indent=4)

threads=[]

for i in range(1):
    t=Thread(target=f,args=())
    t.start()
    threads.append(t)
for t in threads:
    t.join()
