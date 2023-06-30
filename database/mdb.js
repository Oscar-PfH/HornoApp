const { MongoClient } = require('mongodb');

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

async function main(){
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    const uri = "mongodb+srv://oscar_pfh:b8TUTm6mddoSqJIo@store-cluster.2xs0lzm.mongodb.net/test?retryWrites=true&w=majority";
 
    const client = new MongoClient(uri);
 
    try {
        // Connect to the MongoDB cluster
        //await client.connect();
        //console.log('connected!');
 
        // Make the appropriate DB calls
        //await listDatabases(client);
        const database = client.db("horno");
        const customers = database.collection("clientes");
        const qry = { price: 12};

        const customer = await customers.findOne(qry, {});
        console.log(customer);
 
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);