const testInput = {
    "scriptName": "cubeVolume",
    "input": [
        {"paramName": "EdgeLength",
        "value": [
            12
        ]
        }
    ]
}

document.getElementById("testButton").addEventListener("click", async() => {   
    const startTimestamp = new Date()
    console.log(`[${startTimestamp.toISOString()}] - Sending Request`);

    const lambda_url = "API_GATEWAY_URL"
    try {
        const response = await fetch(lambda_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testInput)
        })

        const rawData = await response.json();
        const data = JSON.parse(rawData.body)
        console.log(data)
        document.getElementById("textBox").innerHTML = Object.values(data)[0]["value"][0][0]["data"]
    } catch (error){
        console.log(error)
    } finally {
        const endTimestamp = new Date()
        console.log(`[${endTimestamp.toISOString()}] - Response Received`);
        console.log("That took " + (endTimestamp - startTimestamp)/1000 + " s.")
    }
})