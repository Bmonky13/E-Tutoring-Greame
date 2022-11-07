using FormEncode.Models;
using System;
using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace E_Tutoring_Greame.SQL_C_Sharp
{
    public class UpdatesController : ApiController
    {
        static readonly Dictionary<Guid, Update> updates = new Dictionary<Guid, Update>();

        [HttpPost]
        [ActionName("Complex")]
        public HttpResponseMessage PostComplex(Update update)
        {
          
            if (ModelState.IsValid && update != null)
            {
                // Convert any HTML markup in the status text.
                update.Status = HttpUtility.HtmlEncode(update.Status);

                // Assign a new ID.
                var id = Guid.NewGuid();
                updates[id] = update;

                // Create a 201 response.
#pragma warning disable CS8604 // Possible null reference argument.
                var response = new HttpResponseMessage(HttpStatusCode.Created)
                {
                    Content = new StringContent(content: update.Status)
                };
#pragma warning restore CS8604 // Possible null reference argument.
                response.Headers.Location =
                    new Uri(Url.Link("DefaultApi", new { action = "status", id = id }));
                return response;
            }
            else
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }
        }

        [HttpGet]
        public Update Status(Guid id)
        {
            Update update;
#pragma warning disable CS8600 // Converting null literal or possible null value to non-nullable type.
            if (updates.TryGetValue(id, out update))
            {
                return update;
            }
            else
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
#pragma warning restore CS8600 // Converting null literal or possible null value to non-nullable type.
        }

    }

}
