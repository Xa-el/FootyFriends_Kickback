<script lang="ts">
const apiKey = import.meta.env.VITE_FOOTBALL_KEY;
const url = 'https://corsproxy.io/?' + encodeURIComponent('http://api.football-data.org/v2/competitions/PL/matches?status=FINISHED');
    const options = {
        method: 'GET',
        headers: {
            'X-Auth-Token': apiKey
        }
    };

    async function getRecentMatches() {
        try {
            const response = await fetch(url, options);
            console.log("in try");
            const data = await response.json();
            console.log(data.matches.map(match => ({
                homeTeam: match.homeTeam.name,
                awayTeam: match.awayTeam.name,
                score: `${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam}`
            })));
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    }

    getRecentMatches();
</script>

<h1>Welcome to Bum Page</h1>

