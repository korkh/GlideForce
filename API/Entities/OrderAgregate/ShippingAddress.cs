using Microsoft.EntityFrameworkCore;

namespace API.Entities.OrderAggregate
{
    [Owned]
    public class ShippingAddress : Address
    {

    }
} // we dont need any properties only owned from Address