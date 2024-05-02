<script lang="ts">
	const apiKey = import.meta.env.VITE_FOOTBALL_KEY;
	let teamId = 0;
	// Example: URL for Premier League teams. Replace '2021' with the desired competition ID.
	const teamsUrl = `https://corsproxy.io/?${encodeURIComponent('http://api.football-data.org/v2/competitions/2021/teams')}`;
    // const matchesUrl = `https://corsproxy.io/?${encodeURIComponent(`http://api.football-data.org/v2/teams/${teamId}/matches`)}`;

	let teamsData;

	const options = {
		method: 'GET',
		headers: {
			'X-Auth-Token': apiKey,
			'Cache-Control': 'no-cache'  // Instructs to bypass the cache
		}
	};

	// async function getTeams() {
	// 	try {
	// 		const response = await fetch(teamsUrl, options);
	// 		const data = await response.json();
	// 		const simpleTeamsData = data.teams.map(team => ({ id: team.id, name: team.name }));
	// 		teamsData = data.teams;
	// 		console.log("Teams fetched:");
	// 		console.log(teamsData);
	// 		console.log(simpleTeamsData);

	// 		displayTeams();
	// 	} catch (error) {
	// 		console.error('Failed to fetch teams:', error);
	// 	}
	// }

	let teamMatches;

	async function getRecentMatches() {
		try {
			const teamId = 57; // Ensure teamId is defined if not globally available
			const matchesUrl = `https://corsproxy.io/?${encodeURIComponent(`http://api.football-data.org/v2/teams/${teamId}/matches`)}`;
			const response = await fetch(matchesUrl, options);
			const data = await response.json();
			console.log("Recent matches fetched:");
			
			// Filter out matches where status is 'SCHEDULED'
			const filteredMatches = data.matches.filter(match => match.status !== 'SCHEDULED');
			// console.log(filteredMatches); // Log filtered matches for debugging

			// Use only the last three matches after filtering
			teamMatches = filteredMatches.slice(-3);
			console.log("Last three matches:", teamMatches);

			const matchesContainer = document.getElementById('matches-container');
			if (!matchesContainer) return;
			matchesContainer.innerHTML = ''; // Clear previous entries

			teamMatches.reverse().forEach(match => {
				const matchElement = document.createElement('div');
				matchElement.innerHTML = `
					<p>Home Team: ${match.homeTeam.name}</p>
					<p>Away Team: ${match.awayTeam.name}</p>
					<p>Score: ${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam}</p>
					<hr>
				`;
				matchesContainer.appendChild(matchElement);
			});        
		} catch (error) {
			console.error('Failed to fetch matches:', error);
		}
	}


	function displayTeams() {
		const teamsContainer = document.getElementById('teams-container');
		if (!teamsContainer) return;
		teamsContainer.innerHTML = ''; // Clear previous entries

		// Filter out the team with the specific ID
		teamsData.reverse().forEach(team => {
			if (team.id === 57) { // Check if the team ID is 57
				const teamElement = document.createElement('div');
				teamElement.innerHTML = `
					<p>Team Name: ${team.name}</p>
					<p>Team Short Name: ${team.shortName || 'N/A'}</p>
					<p>Venue: ${team.venue || 'N/A'}</p>
					<hr>
				`;
				teamsContainer.appendChild(teamElement);
			}
		});
	}


	// getTeams();
	getRecentMatches(); // You might want to call this function after confirming the team ID or from within the getTeams if dynamically setting team ID
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