public class ActivityController : Controller
{
    private readonly ApplicationDbContext _context;

    public ActivityController(ApplicationDbContext context)
    {
        _context = context;
    }

    public IActionResult Index()
    {
        return View();
    }

    [HttpPost]
    public async Task<IActionResult> SaveActivity([FromBody] Activity activity)
    {
        if (ModelState.IsValid)
        {
            activity.Date = DateTime.Now;
            _context.Activities.Add(activity);
            await _context.SaveChangesAsync();
            return Json(new { success = true });
        }
        return Json(new { success = false });
    }

    [HttpGet]
    public async Task<IActionResult> GetActivities()
    {
        var activities = await _context.Activities
            .OrderByDescending(a => a.Date)
            .Take(100)
            .ToListAsync();
        return Json(activities);
    }

    [HttpGet]
    public async Task<IActionResult> GetStats()
    {
        var stats = await _context.Activities
            .GroupBy(a => a.Discipline)
            .Select(g => new ActivityStats
            {
                Discipline = g.Key,
                TotalSessions = g.Count(),
                AverageTime = g.Average(a => a.Duration) / 60.0,
                AverageCalories = g.Average(a => a.CaloriesBurned)
            })
            .ToListAsync();

        return Json(stats);
    }
}