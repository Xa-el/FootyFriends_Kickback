<script lang="ts">
const apiKey = import.meta.env.VITE_FOOTBALL_KEY;
const plUrl = 'https://corsproxy.io/?' + encodeURIComponent('http://api.football-data.org/v2/competitions/PL/matches?status=FINISHED');
const italyUrl = 'https://corsproxy.io/?' + encodeURIComponent('http://api.football-data.org/v2/competitions/SA/matches?status=FINISHED');
const laLigaUrl = 'https://corsproxy.io/?' + encodeURIComponent('http://api.football-data.org/v2/competitions/PD/matches?status=FINISHED');
const farmersUrl = 'https://corsproxy.io/?' + encodeURIComponent('http://api.football-data.org/v2/competitions/FL1/matches?status=FINISHED');
const blUrl = 'https://corsproxy.io/?' + encodeURIComponent('http://api.football-data.org/v2/competitions/BL1/matches?status=FINISHED');
const clUrl = 'https://corsproxy.io/?' + encodeURIComponent('http://api.football-data.org/v2/competitions/CL/matches?status=FINISHED');



    const options = {
        method: 'GET',
        headers: {
            'X-Auth-Token': apiKey
        }
    };

    async function getRecentMatches() {
        try {
            const response = await fetch(plUrl, options);
            //this gets the data in json form I think
            const data = await response.json();
            const last10plmatches = data.matches.slice(-10); //basically array length - 10 is how to think about this
            console.log(last10plmatches.map(match => ({
                homeTeam: match.homeTeam.name,
                awayTeam: match.awayTeam.name,
                score: `${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam}`
            })));
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    }
    async function getMatches() {
        try {
            const italyResponse = await fetch(italyUrl, options);
            const spainResponse = await fetch(laLigaUrl, options);
            const franceResponse = await fetch(farmersUrl, options);
            const germanyResponse = await fetch(blUrl, options);
            const CLResponse = await fetch(clUrl, options);

            //this gets the data in json form I think
            const italyData = await italyResponse.json();
            const spainData = await spainResponse.json();
            const franceData = await franceResponse.json();
            const germanyData = await germanyResponse.json();
            const CLData = await CLResponse.json();




            const italyMatches = italyData.matches.slice(-10); //basically array length - 10 is how to think about this
            console.log("italy");
            console.log(italyMatches.map(match => ({
                homeTeam: match.homeTeam.name,
                awayTeam: match.awayTeam.name,
                score: `${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam}`
            })));
            const spainMatches = spainData.matches.slice(-10); 
            console.log("spain");
            console.log(spainMatches.map(match => ({
                homeTeam: match.homeTeam.name,
                awayTeam: match.awayTeam.name,
                score: `${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam}`
            })));
            const franceMatches = franceData.matches.slice(-10); 
            console.log("france");
            console.log(franceMatches.map(match => ({
                homeTeam: match.homeTeam.name,
                awayTeam: match.awayTeam.name,
                score: `${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam}`
            })));
            const germanyMatches = germanyData.matches.slice(-10);          
            console.log("germany");
            console.log(germanyMatches.map(match => ({
                homeTeam: match.homeTeam.name,
                awayTeam: match.awayTeam.name,
                score: `${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam}`
            })));
            const CLMatches = CLData.matches.slice(-10); //basically array length - 10 is how to think about this
            console.log("Champions League");
            console.log(CLMatches.map(match => ({
                homeTeam: match.homeTeam.name,
                awayTeam: match.awayTeam.name,
                score: `${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam}`
            })));



        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    }
    getRecentMatches();
    getMatches();
</script>

<h1>Welcome to Bum Page</h1>

