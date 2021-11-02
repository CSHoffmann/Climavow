import json
from itertools import chain
import pandas as pd

if __name__ == "__main__":
    meta = {
        "source" : "",
        "date" : "",
        "title" : "",
        "url" : "",
    }

    data = {}
    csv = pd.read_csv("./API_EN.ATM.CO2E.KT_DS2_en_csv_v2_3011692.csv", skiprows=4)

    for idx, row in csv.iterrows():
        row_data = {}
        label = row["Country Code"]
        rel_keys = ["Country Name"]

        for key in chain(rel_keys, range(1970, 2021)):
            row_data[key] = row[str(key)]

        data[label] = row_data
    

    json_str = json.dumps({"meta": meta, "data": data})
    with open("./data.json", "w") as f:
        f.write(json_str)








