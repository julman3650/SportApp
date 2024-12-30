public class Activity
{
    public int Id { get; set; }
    public string Discipline { get; set; }
    public DateTime Date { get; set; }
    public int Duration { get; set; }  // w sekundach
    public int CaloriesBurned { get; set; }
    public string UserId { get; set; }  // dla przyszłej implementacji auth
}
public class ActivityStats
{
    public string Discipline { get; set; }
    public int TotalSessions { get; set; }
    public double AverageTime { get; set; }  // w minutach
    public double AverageCalories { get; set; }
}