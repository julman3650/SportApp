using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Threading.Tasks;
using SportTimerAppNew.Models;

namespace SportTimerAppNew.Data
{
    public class CosmosDbService
    {
        private Container _container;

        public CosmosDbService(IConfiguration config)
        {
            var client = new CosmosClient(config["ConnectionStrings:CosmosDb"]);
            _container = client.GetContainer(config["CosmosDbSettings:DatabaseName"], config["CosmosDbSettings:ContainerName"]);
        }

        public async Task<Activity> AddActivityAsync(Activity activity)
        {
            var response = await _container.CreateItemAsync(activity, new PartitionKey(activity.Id));
            return response.Resource;
        }

        public async Task<List<Activity>> GetActivitiesAsync()
        {
            var query = new QueryDefinition("SELECT * FROM c");
            var iterator = _container.GetItemQueryIterator<Activity>(query);
            var results = new List<Activity>();

            while (iterator.HasMoreResults)
            {
                var response = await iterator.ReadNextAsync();
                results.AddRange(response);
            }

            return results;
        }
    }
}