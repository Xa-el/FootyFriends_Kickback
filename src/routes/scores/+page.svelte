<script lang="ts">
	const apiKey = import.meta.env.VITE_FOOTBALL_KEY;
	const plUrl = `https://corsproxy.io/?${encodeURIComponent(`http://api.football-data.org/v2/competitions/PL/matches?status=FINISHED&ts=${Date.now()}`)}`;

	let last3plmatches;

	const options = {
		method: 'GET',
		headers: {
			'X-Auth-Token': apiKey,
			'Cache-Control': 'no-cache'  // Instructs to bypass the cache
		}
	};

	async function getRecentMatches() {
		try {
			const response = await fetch(plUrl, options);
			const data = await response.json();
			last3plmatches = data.matches.slice(-3);
			displayMatches();
		} catch (error) {
			console.error('Failed to fetch data:', error);
		}
	}

	function displayMatches() {
		const matchesContainer = document.getElementById('matches-container');
		last3plmatches.forEach(match => {
			const matchElement = document.createElement('div');
			matchElement.innerHTML = `
                    <p>Date: ${match.utcDate}</p>
                    <p>Home Team: ${match.homeTeam.name}</p>
                    <p>Away Team: ${match.awayTeam.name}</p>
                    <p>Score: ${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam}</p>
                    <hr>
                `;
			matchesContainer.appendChild(matchElement);
		});
	}
	getRecentMatches();
</script>



<html lang="en">
		<head>
			<title>Premier League Matches</title>
		</head>
		<body>
			<h1>Premier League Matches</h1>
			<div id="matches-container" class="text-white"></div>
		</body>
</html>