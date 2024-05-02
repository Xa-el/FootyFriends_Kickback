<script lang="ts">
	const apiKey = import.meta.env.VITE_FOOTBALL_KEY;
	const plUrl = `https://corsproxy.io/?${encodeURIComponent(`http://api.football-data.org/v2/competitions/PL/matches?status=FINISHED&ts=${Date.now()}`)}`;




	const teamImages = {
        TottenhamHotspurFC: 'https://i.ibb.co/hyhWqX4/tottenham.jpg',
        NottinghamForestFC: 'https://i.ibb.co/d2Qhy5R/nottingham.jpg',
        ManchesterCityFC: 'https://i.ibb.co/7Y0P6x1/manchestercity.jpg',
        BrightonNHoveAlbionFC: 'https://i.ibb.co/5nQKnVP/brighton.jpg',
        ArsenalFC: 'https://i.ibb.co/zmBMXR9/arsenal.jpg',
        AFCBournemouth: 'https://i.ibb.co/dpmM1XG/bournemouth.jpg',
		wolves:'https://i.ibb.co/92htgDQ/wolves.jpg',
		westham:'https://i.ibb.co/Ns6w2f3/westham.jpg',
		sheffield:'https://i.ibb.co/zQZMZY1/sheffield.jpg',
		newcastle:'https://i.ibb.co/BLG3b3r/newcastle.jpg',
		manu:'https://i.ibb.co/FhxthPg/manunited.jpg',
		luton:'https://i.ibb.co/xD87z64/lutontown.jpg',
		liverpool:'https://i.ibb.co/thWYZMy/liverpool.jpg',
		fulham:'https://i.ibb.co/k6zZwwt/fulham.jpg',
		everton:'https://i.ibb.co/fQWzc3Z/everton.jpg',
		crystalPalace:'https://i.ibb.co/PWTsMpK/crystalpalace.jpg',
		chelsea:'https://i.ibb.co/YNw18cs/chelsea.jpg',
		burnley:'https://i.ibb.co/T05FXkt/burnley.jpg',
		brentford:'https://i.ibb.co/2NhwgSs/brentford.jpg',
		villa : 'https://i.ibb.co/6wWPG9M/astonvilla.jpg',
        // Add all other teams following the same format
    };



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

	let homeTeam = '';
	let awayTeam = '';

	function displayMatches() {
		const matchesContainer = document.getElementById('matches-container');
		last3plmatches.reverse().forEach(match => {
			const matchElement = document.createElement('div');
			let homeTeamKey = match.homeTeam.name.replace(/\s+/g, '').replace(/&/g, 'N');
			let awayTeamKey = match.awayTeam.name.replace(/\s+/g, '').replace(/&/g, 'N');
			let homeTeamImg = teamImages[homeTeamKey];
			let awayTeamImg = teamImages[awayTeamKey];

			matchElement.innerHTML = `
			<div class="flex flex-row items-center justify-center space-x-8 mt-2 bg-side-green">
				<!--Game 1-->
				<div class="flex">
					<!--Home-->
					<img src=${homeTeamImg} alt="home1" class="w-14 h-14 object-cover rounded-full border-4 border-neon-green">
				</div>

				<div class="flex flex-col items-center justify-center">
					<!--Match Info-->
					<p class="text-white font-bold text-sm md:text-base lg:text-base xl:text-base text-center mt-4">VS</p>
                    <p>${match.score.fullTime.homeTeam} - ${match.score.fullTime.awayTeam}</p>
				</div>

				<div class="flex">
					<!--Away-->
					<img src=${awayTeamImg} alt="away1" class="w-14 h-14 object-cover rounded-full border-4 border-neon-green">
				</div>

			</div>

                `;
			matchesContainer.appendChild(matchElement);
			// <p>Date: ${match.utcDate}</p>
            //         <p>Home Team: ${match.homeTeam.name}</p>
            //         <p>Away Team: ${match.awayTeam.name}</p>
            //         <hr>
		});
	}
	getRecentMatches();
</script>



<html lang="en">
		<!-- <head>
			<title>Premier League Matches</title>
		</head> -->
		<body>
			<!-- <h1>Premier League Matches</h1> -->
			<div id="matches-container" class="text-white bg-side-green"></div>
		</body>
</html>
