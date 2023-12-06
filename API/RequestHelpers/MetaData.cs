namespace API.RequestHelpers
{
    // info about pagination
    public class MetaData
    {
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; } //total items available to query
    }
}