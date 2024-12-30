export class SportTimer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time: 0,
            isRunning: false,
            discipline: '',
            activities: JSON.parse(localStorage.getItem('activities') || '[]'),
            calories: 0,
            activeTab: 'timer'
        };
        
        this.METValues = {
            'bieganie': 8.0,
            'rower': 7.0,
            'pływanie': 6.0,
            'spacer': 3.5,
            'joga': 2.5,
        };
    }

    componentDidMount() {
        this.loadActivities();
    }

    loadActivities() {
        const savedActivities = localStorage.getItem('activities');
        if (savedActivities) {
            this.setState({ activities: JSON.parse(savedActivities) });
        }
    }

    startTimer = () => {
        if (!this.state.discipline) {
            alert('Proszę wybrać dyscyplinę sportową');
            return;
        }

        if (!this.state.isRunning) {
            this.timerInterval = setInterval(() => {
                this.setState(prev => ({
                    time: prev.time + 1,
                    calories: this.calculateCalories(prev.time + 1, prev.discipline)
                }));
            }, 1000);
        } else {
            clearInterval(this.timerInterval);
        }

        this.setState(prev => ({ isRunning: !prev.isRunning }));
    };

    stopTimer = () => {
        if (this.state.time === 0) return;

        clearInterval(this.timerInterval);
        
        const newActivity = {
            id: Date.now(),
            discipline: this.state.discipline,
            time: this.state.time,
            calories: this.state.calories,
            date: new Date().toISOString()
        };

        const updatedActivities = [...this.state.activities, newActivity];
        
        localStorage.setItem('activities', JSON.stringify(updatedActivities));
        
        this.setState({
            activities: updatedActivities,
            time: 0,
            calories: 0,
            isRunning: false
        });
    };

    calculateCalories(seconds, activity) {
        const MET = this.METValues[activity.toLowerCase()] || 5.0;
        const hours = seconds / 3600;
        const weight = 70; // kg
        return Math.floor((MET * 3.5 * weight * hours) / 200);
    }

    formatTime(seconds) {
        return new Date(seconds * 1000).toISOString().slice(11, 19);
    }

    render() {
        return (
            <div className="container">
                {/* Timer Card */}
                <div className="card">
                    <h2>Sport Timer</h2>
                    <select 
                        className="select"
                        value={this.state.discipline}
                        onChange={(e) => this.setState({ discipline: e.target.value })}
                    >
                        <option value="">Wybierz dyscyplinę</option>
                        {Object.keys(this.METValues).map(sport => (
                            <option key={sport} value={sport}>
                                {sport.charAt(0).toUpperCase() + sport.slice(1)}
                            </option>
                        ))}
                    </select>
                    
                    <div style={{ fontSize: '48px', margin: '20px 0' }}>
                        {this.formatTime(this.state.time)}
                    </div>
                    
                    <div style={{ fontSize: '24px', margin: '20px 0' }}>
                        Spalone kalorie: {this.state.calories}
                    </div>
                    
                    <button 
                        className={`button ${this.state.isRunning ? 'button-pause' : 'button-start'}`}
                        onClick={this.startTimer}
                    >
                        {this.state.isRunning ? 'Pauza' : 'Start'}
                    </button>
                    
                    <button 
                        className="button button-stop"
                        onClick={this.stopTimer}
                    >
                        Zakończ
                    </button>
                </div>

                {/* Tabs */}
                <div className="tabs">
                    <button 
                        className={`tab ${this.state.activeTab === 'timer' ? 'active' : ''}`}
                        onClick={() => this.setState({ activeTab: 'timer' })}
                    >
                        Timer
                    </button>
                    <button 
                        className={`tab ${this.state.activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => this.setState({ activeTab: 'history' })}
                    >
                        Historia
                    </button>
                    <button 
                        className={`tab ${this.state.activeTab === 'stats' ? 'active' : ''}`}
                        onClick={() => this.setState({ activeTab: 'stats' })}
                    >
                        Statystyki
                    </button>
                </div>

                {/* Content based on active tab */}
                {this.state.activeTab === 'history' && (
                    <div className="card">
                        <h3>Historia aktywności</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Data</th>
                                    <th>Dyscyplina</th>
                                    <th>Czas</th>
                                    <th>Kalorie</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.activities.map(activity => (
                                    <tr key={activity.id}>
                                        <td>{new Date(activity.date).toLocaleDateString()}</td>
                                        <td>{activity.discipline}</td>
                                        <td>{this.formatTime(activity.time)}</td>
                                        <td>{activity.calories}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {this.state.activeTab === 'stats' && (
                    <div className="card">
                        <h3>Statystyki</h3>
                        <div className="chart-container">
                            {/* Wykres kalorii */}
                            <LineChart width={800} height={300} data={this.state.activities.slice(-7)}>
                                <XAxis dataKey="date" />
                                <YAxis />
                                <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
                                <Line type="monotone" dataKey="calories" stroke="#8884d8" />
                                <Tooltip />
                            </LineChart>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}