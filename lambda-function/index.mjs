import rhino3dm from "rhino3dm"
import RhinoCompute from "compute-rhino3d"
import AWS from "aws-sdk"

const s3 = new AWS.S3();
let definition, rhino

async function computeGH(input) {
    const trees = []
    for (let i=0; i<input.length; i++){
        const param = new RhinoCompute.Grasshopper.DataTree(input[i]["paramName"])
        param.append([0], input[i].value)
        trees.push(param)
    }

    try {
        // TODO: error handling, return something to the front end when an error occured
        const res = await RhinoCompute.Grasshopper.evaluateDefinition(definition, trees);
        console.log(res);
        
        // Enforce each "RH_OUT:**" to only have 1 content
        if (Object.keys(res.values).length > 0){ 
            const data = []
            Object.keys(res.values).forEach(key => {
                const content = {}
                content["key"] = res.values[key].ParamName;
                content["value"] = Object.values(res.values[key].InnerTree);
                data.push(content);
            });
            console.log(data);
            return data;
        } else {
            console.error(`Incompatible output data structure`);
        }
    }
    catch(error){
        console.log(error);
        console.error(`Something went wrong`);
    }
}

export const handler = async (event) => {
    // Initialize rhino compute with gh script of choice
    await rhino3dm().then(async m => {
        rhino = m; // global
    
        RhinoCompute.url = "RHINO_COMPUTE_URL"; // RhinoCompute server url - Rhino7 (currently on t3.micro)
        RhinoCompute.apiKey = "RHINO_COMPUTE_APIKEY" // RhinoCompute server api key
    
        try {
            const params = {
                Bucket: "S3_BUCKE_NAME",
                Key: 'Scripts/' + event['scriptName'] + '.gh'   // Specify gh script within S3 bucket here
            };
            const data = await s3.getObject(params).promise();
            
            const buffer = data.Body;
            const building = new Uint8Array(buffer);
            definition = building;
        } catch (error) {
            console.log(error)
        }
    });

    const res = await computeGH(event['input'])
    const responseBody = JSON.stringify(res);
    console.log('Response body:', responseBody);
      
    const response = {
      statusCode: 200,
      body: responseBody,
    };
    return response;
};