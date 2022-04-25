import requests
import json
from threading import Thread

token="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6ImFkbWluIiwiZXhwIjoxNjU3MzU0MjAzfQ.6TGawpp3T1YKGMFiaDAw1E_gcFJFww7lsBqheFhvuV8"

def f(id):
    url=f"https://colledor-api.tk/challenge-info/{id}"
    res=requests.get(url).json()
    with open(f"./challenge-info/{id}.json","w")as f:
        json.dump(res,f,indent=4)
    print(id)

threads=[]

for i in range(1,1261):
    t=Thread(target=f,args=(i,))
    t.start()
    threads.append(t)
for t in threads:
    t.join()
