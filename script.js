// =============================================
// API KEYS CONFIGURATION - REPLACE WITH YOUR KEYS
// =============================================
const API_KEYS = {
  CRICKET: '953ae54b-4e2f-4efb-9c26-9141ef314040',
  YOUTUBE: 'AIzaSyBNVHGoGBkQUGRJldDApufwlrFHkme50-k',
  NEWS: '7b383660051c4f57925f5d554a894858'
};
// =============================================

// Utility Functions
// =============================================
async function fetchAPI(url, options = {}) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    showError(error.message);
    return null;
  }
}

function showError(message) {
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> Error: ${message}`;
  document.querySelector('main').prepend(errorElement);
  
  setTimeout(() => errorElement.remove(), 5000);
}

function getCountryCode(country) {
  const countryMap = {
    'india': 'in', 'australia': 'au', 'england': 'gb-eng',
    'new zealand': 'nz', 'pakistan': 'pk', 'south africa': 'za',
    'bangladesh': 'bd', 'afghanistan': 'af', 'sri lanka': 'lk',
    'west indies': 'gd', 'ireland': 'ie', 'zimbabwe': 'zw'
  };
  
  const normalizedCountry = country?.toLowerCase();
  return countryMap[normalizedCountry] || 'in';
}

// =============================================
// API Wrappers with Fallback Data
// =============================================
const CricketAPI = {
  baseUrl: 'https://api.cricapi.com/v1',

  async getLiveMatches() {
    try {
      const url = `${this.baseUrl}/currentMatches?apikey=${API_KEYS.CRICKET}&offset=0`;
      const data = await fetchAPI(url);
      return data?.data || this.getFallbackMatches();
    } catch (error) {
      return this.getFallbackMatches();
    }
  },

  async getTeamRankings(type = 'odi') {
    try {
      const url = `${this.baseUrl}/seriesRankings?apikey=${API_KEYS.CRICKET}&type=${type}`;
      const data = await fetchAPI(url);
      return data?.data?.rankings || this.getFallbackTeamRankings(type);
    } catch (error) {
      return this.getFallbackTeamRankings(type);
    }
  },

  async getPlayerRankings(type = 'batsmen') {
    try {
      const url = `${this.baseUrl}/playerRankings?apikey=${API_KEYS.CRICKET}&type=${type}`;
      const data = await fetchAPI(url);
      return data?.data || this.getFallbackPlayerRankings(type);
    } catch (error) {
      return this.getFallbackPlayerRankings(type);
    }
  },

  // Fallback data functions
  getFallbackMatches() {
    console.log('Using fallback matches data');
    return [
      {
        id: '1',
        teams: ['India', 'Australia'],
        series: 'Test Series',
        matchStarted: true,
        matchEnded: false,
        score: [
          { inning: 'India 1st innings', r: 328, w: 10 },
          { inning: 'Australia 1st innings', r: 256, w: 10 }
        ],
        result: ''
      },
      {
        id: '2',
        teams: ['England', 'New Zealand'],
        series: 'ODI Series',
        matchStarted: true,
        matchEnded: false,
        score: [
          { inning: 'England innings', r: '287/6', w: 6 },
          { inning: 'New Zealand innings', r: '210/3', w: 3 }
        ],
        result: ''
      },
      {
        id: '3',
        teams: ['South Africa', 'Pakistan'],
        series: 'T20 Series',
        matchStarted: false,
        matchEnded: false,
        score: [],
        result: ''
      }
    ];
  },

  getFallbackTeamRankings(type) {
    console.log(`Using fallback ${type} team rankings`);
    const rankings = {
      odi: [
        { rank: 1, team: "India", matches: 32, points: 3890, rating: 119 },
        { rank: 2, team: "Australia", matches: 30, points: 3456, rating: 113 },
        { rank: 3, team: "England", matches: 28, points: 3245, rating: 112 },
        { rank: 4, team: "New Zealand", matches: 27, points: 2987, rating: 107 },
        { rank: 5, team: "Pakistan", matches: 25, points: 2567, rating: 102 }
      ],
      test: [
        { rank: 1, team: "Australia", matches: 28, points: 3567, rating: 124 },
        { rank: 2, team: "India", matches: 25, points: 2987, rating: 117 },
        { rank: 3, team: "England", matches: 30, points: 3456, rating: 113 },
        { rank: 4, team: "South Africa", matches: 22, points: 2345, rating: 106 },
        { rank: 5, team: "New Zealand", matches: 20, points: 1987, rating: 99 }
      ],
      t20: [
        { rank: 1, team: "India", matches: 45, points: 11890, rating: 267 },
        { rank: 2, team: "England", matches: 38, points: 9876, rating: 259 },
        { rank: 3, team: "Pakistan", matches: 36, points: 9456, rating: 254 },
        { rank: 4, team: "South Africa", matches: 32, points: 8123, rating: 248 },
        { rank: 5, team: "Australia", matches: 30, points: 7654, rating: 242 }
      ]
    };
    return rankings[type] || [];
  },

  getFallbackPlayerRankings(type) {
    console.log(`Using fallback ${type} player rankings`);
    const rankings = {
      batsmen: [
        { rank: 1, name: "Virat Kohli", country: "India", rating: 890 },
        { rank: 2, name: "Steve Smith", country: "Australia", rating: 875 },
        { rank: 3, name: "Kane Williamson", country: "New Zealand", rating: 862 },
        { rank: 4, name: "Joe Root", country: "England", rating: 850 },
        { rank: 5, name: "Babar Azam", country: "Pakistan", rating: 845 }
      ],
      bowlers: [
        { rank: 1, name: "Pat Cummins", country: "Australia", rating: 890 },
        { rank: 2, name: "Jasprit Bumrah", country: "India", rating: 875 },
        { rank: 3, name: "Trent Boult", country: "New Zealand", rating: 862 },
        { rank: 4, name: "Kagiso Rabada", country: "South Africa", rating: 850 },
        { rank: 5, name: "James Anderson", country: "England", rating: 845 }
      ],
      allrounders: [
        { rank: 1, name: "Ben Stokes", country: "England", rating: 390 },
        { rank: 2, name: "Ravindra Jadeja", country: "India", rating: 385 },
        { rank: 3, name: "Shakib Al Hasan", country: "Bangladesh", rating: 382 },
        { rank: 4, name: "Jason Holder", country: "West Indies", rating: 375 },
        { rank: 5, name: "Mitchell Marsh", country: "Australia", rating: 370 }
      ]
    };
    return rankings[type] || [];
  }
};

async function getCricketNews() {
  try {
    const url = `https://newsapi.org/v2/everything?q=cricket&apiKey=${API_KEYS.NEWS}&pageSize=3`;
    const data = await fetchAPI(url);
    return data?.articles || getFallbackNews();
  } catch (error) {
    return getFallbackNews();
  }
}

function getFallbackNews() {
  console.log('Using fallback news data');
  return [
    {
      title: "India wins thrilling match against Australia",
      description: "In a nail-biting finish, India defeated Australia by 5 runs in the final ODI.",
      url: "#",
      urlToImage: "https://via.placeholder.com/300x200?text=Cricket+News",
      publishedAt: new Date().toISOString(),
      source: { name: "Cricket News" }
    },
    {
      title: "New rules announced for upcoming T20 World Cup",
      description: "ICC has announced several rule changes for the next T20 World Cup tournament.",
      url: "#",
      urlToImage: "https://via.placeholder.com/300x200?text=T20+World+Cup",
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      source: { name: "Sports Daily" }
    },
    {
      title: "Player of the year awards announced",
      description: "The annual cricket awards ceremony recognized outstanding performances from around the world.",
      url: "#",
      urlToImage: "https://via.placeholder.com/300x200?text=Player+Awards",
      publishedAt: new Date(Date.now() - 172800000).toISOString(),
      source: { name: "Cricket World" }
    }
  ];
}

async function getCricketVideos() {
  try {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEYS.YOUTUBE}&part=snippet&q=cricket&maxResults=3&type=video`;
    const data = await fetchAPI(url);
    return data?.items || getFallbackVideos();
  } catch (error) {
    return getFallbackVideos();
  }
}

function getFallbackVideos() {
  console.log('Using fallback videos data');
  return [
    {
      id: { videoId: 'dummy1' },
      snippet: {
        title: "Best Cricket Moments 2023",
        channelTitle: "Cricket Highlights",
        thumbnails: {
          medium: { url: "https://via.placeholder.com/300x200?text=Cricket+Video" }
        }
      }
    },
    {
      id: { videoId: 'dummy2' },
      snippet: {
        title: "Top 10 Wickets of the Year",
        channelTitle: "Cricket World",
        thumbnails: {
          medium: { url: "https://via.placeholder.com/300x200?text=Top+Wickets" }
        }
      }
    },
    {
      id: { videoId: 'dummy3' },
      snippet: {
        title: "Interview with Player of the Year",
        channelTitle: "Sports Channel",
        thumbnails: {
          medium: { url: "https://via.placeholder.com/300x200?text=Player+Interview" }
        }
      }
    }
  ];
}

// =============================================
// Rendering Functions
// =============================================
async function fetchLiveMatches() {
  const container = document.getElementById('matches-container');
  container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
  
  try {
    const matches = await CricketAPI.getLiveMatches();
    
    if (!matches.length) {
      container.innerHTML = '<div class="no-matches">No live matches currently</div>';
      return;
    }
    
    container.innerHTML = '';
    
    matches.slice(0, 3).forEach(match => {
      const team1 = match.teams?.[0] || 'Team 1';
      const team2 = match.teams?.[1] || 'Team 2';
      const isLive = match.matchStarted && !match.matchEnded;
      
      const matchCard = document.createElement('div');
      matchCard.className = 'match-card';
      matchCard.innerHTML = `
        <div class="match-header">
          <div class="series">${match.series || 'Cricket Match'}</div>
          <div class="status ${isLive ? 'live' : ''}">
            ${isLive ? 'LIVE' : (match.matchEnded ? 'COMPLETED' : 'UPCOMING')}
          </div>
        </div>
        <div class="match-teams">
          <div class="team">
            <div class="team-logo">${team1.charAt(0)}</div>
            <div class="team-info">
              <div class="team-name">${team1}</div>
              <div class="team-score">${getTeamScore(match.score, team1)}</div>
            </div>
          </div>
          <div class="team">
            <div class="team-logo">${team2.charAt(0)}</div>
            <div class="team-info">
              <div class="team-name">${team2}</div>
              <div class="team-score">${getTeamScore(match.score, team2)}</div>
            </div>
          </div>
        </div>
        <div class="match-result">
          ${isLive ? 'In Progress' : (match.matchEnded ? (match.result || 'Match ended') : 'Match not started')}
        </div>
      `;
      container.appendChild(matchCard);
    });
  } catch (error) {
    console.error('Error loading matches:', error);
    container.innerHTML = '<div class="error-message">Failed to load matches</div>';
  }
}

function getTeamScore(scores, team) {
  if (!scores || !Array.isArray(scores)) return '-';
  const teamScore = scores.find(s => s.inning?.includes(team));
  return teamScore?.r || '-';
}

async function fetchArticles() {
  const container = document.getElementById('articles-container');
  container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
  
  try {
    const articles = await getCricketNews();
    
    if (!articles.length) {
      container.innerHTML = '<div class="no-articles">No articles available</div>';
      return;
    }
    
    container.innerHTML = '';
    
    articles.slice(0, 3).forEach(article => {
      const articleCard = document.createElement('div');
      articleCard.className = 'article-card';
      articleCard.innerHTML = `
        <div class="article-image" style="background-image: url('${article.urlToImage || 'https://via.placeholder.com/300x200?text=No+Image'}')"></div>
        <div class="article-content">
          <div class="article-source">
            <img src="https://via.placeholder.com/20" alt="${article.source?.name || 'Source'}">
            ${article.source?.name || 'News Source'}
          </div>
          <h3 class="article-title">${article.title || 'No title available'}</h3>
          <p class="article-excerpt">${article.description || 'No description available'}</p>
          <div class="article-meta">
            <span>${article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ''}</span>
            <a href="${article.url || '#'}" target="_blank">Read More</a>
          </div>
        </div>
      `;
      container.appendChild(articleCard);
    });
  } catch (error) {
    console.error('Error loading articles:', error);
    container.innerHTML = '<div class="error-message">Failed to load articles</div>';
  }
}

async function fetchVideos() {
  const container = document.getElementById('videos-container');
  container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';
  
  try {
    const videos = await getCricketVideos();
    
    if (!videos.length) {
      container.innerHTML = '<div class="no-videos">No videos available</div>';
      return;
    }
    
    container.innerHTML = '';
    
    videos.slice(0, 3).forEach(video => {
      const videoCard = document.createElement('div');
      videoCard.className = 'video-card';
      videoCard.setAttribute('data-video-id', video.id.videoId);
      videoCard.innerHTML = `
        <div class="video-thumbnail">
          <img src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}">
          <div class="play-button">
            <i class="fas fa-play"></i>
          </div>
        </div>
        <div class="video-info">
          <h3 class="video-title">${video.snippet.title}</h3>
          <div class="video-channel">
            <img src="https://via.placeholder.com/30" alt="${video.snippet.channelTitle}">
            ${video.snippet.channelTitle}
          </div>
        </div>
      `;
      container.appendChild(videoCard);
    });
  } catch (error) {
    console.error('Error loading videos:', error);
    container.innerHTML = '<div class="error-message">Failed to load videos</div>';
  }
}

async function fetchTeamRankings() {
  const types = ['odi', 'test', 't20'];
  
  for (const type of types) {
    const tableId = `teams-${type}`;
    const tbody = document.querySelector(`#${tableId} tbody`);
    tbody.innerHTML = '<tr><td colspan="5" class="loading"><div class="spinner"></div></td></tr>';
    
    try {
      const rankings = await CricketAPI.getTeamRankings(type);
      
      if (!rankings?.length) {
        tbody.innerHTML = '<tr><td colspan="5">No ranking data available</td></tr>';
        continue;
      }
      
      tbody.innerHTML = '';
      
      rankings.slice(0, 5).forEach(team => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${team.rank}</td>
          <td>
            <div class="team-rank">
              <div class="flag">
                <img src="https://flagcdn.com/w20/${getCountryCode(team.team)}.png" 
                     alt="${team.team}" loading="lazy">
              </div>
              <div class="name">${team.team}</div>
            </div>
          </td>
          <td>${team.matches}</td>
          <td>${team.points}</td>
          <td class="rating">${team.rating}</td>
        `;
        tbody.appendChild(row);
      });
    } catch (error) {
      console.error(`Error loading ${type} rankings:`, error);
      tbody.innerHTML = '<tr><td colspan="5">Failed to load rankings</td></tr>';
    }
  }
}

async function fetchPlayerRankings() {
  const types = [
    { apiType: 'batsmen', tableId: 'players-batsmen' },
    { apiType: 'bowlers', tableId: 'players-bowlers' },
    { apiType: 'allrounders', tableId: 'players-allrounders' }
  ];
  
  for (const { apiType, tableId } of types) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    tbody.innerHTML = '<tr><td colspan="4" class="loading"><div class="spinner"></div></td></tr>';
    
    try {
      const rankings = await CricketAPI.getPlayerRankings(apiType);
      
      if (!rankings?.length) {
        tbody.innerHTML = '<tr><td colspan="4">No ranking data available</td></tr>';
        continue;
      }
      
      tbody.innerHTML = '';
      
      rankings.slice(0, 5).forEach(player => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${player.rank}</td>
          <td>${player.name}</td>
          <td>
            <div class="team-rank">
              <div class="flag">
                <img src="https://flagcdn.com/w20/${getCountryCode(player.country)}.png" 
                     alt="${player.country}" loading="lazy">
              </div>
              <div class="name">${player.country}</div>
            </div>
          </td>
          <td class="rating">${player.rating}</td>
        `;
        tbody.appendChild(row);
      });
    } catch (error) {
      console.error(`Error loading ${apiType} rankings:`, error);
      tbody.innerHTML = '<tr><td colspan="4">Failed to load rankings</td></tr>';
    }
  }
}

// =============================================
// Event Listeners
// =============================================
document.querySelector('.mobile-menu').addEventListener('click', function() {
  document.querySelector('nav').classList.toggle('active');
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

document.addEventListener('click', function(e) {
  if (e.target.closest('.play-button')) {
    const videoId = e.target.closest('.video-card').getAttribute('data-video-id');
    const videoPlayer = document.getElementById('videoPlayer');
    videoPlayer.innerHTML = `
      <iframe width="100%" height="400" src="https://www.youtube.com/embed/${videoId}?autoplay=1" 
      frameborder="0" allowfullscreen></iframe>
    `;
    document.getElementById('videoModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
});

document.querySelector('.close-modal').addEventListener('click', function() {
  document.getElementById('videoModal').style.display = 'none';
  document.getElementById('videoPlayer').innerHTML = '';
  document.body.style.overflow = 'auto';
});

window.addEventListener('click', function(e) {
  if (e.target === document.getElementById('videoModal')) {
    document.getElementById('videoModal').style.display = 'none';
    document.getElementById('videoPlayer').innerHTML = '';
    document.body.style.overflow = 'auto';
  }
});

// Ranking tab switching
document.querySelectorAll('.ranking-tab').forEach(tab => {
  tab.addEventListener('click', function() {
    const tabId = this.getAttribute('data-tab');
    const container = this.closest('.ranking-card');
    
    // Update active tab
    container.querySelectorAll('.ranking-tab').forEach(t => t.classList.remove('active'));
    this.classList.add('active');
    
    // Show corresponding table
    container.querySelectorAll('.ranking-table').forEach(table => {
      table.style.display = 'none';
    });
    document.getElementById(tabId).style.display = 'table';
  });
});

// =============================================
// Initialization
// =============================================
document.addEventListener('DOMContentLoaded', async function() {
  try {
    // Load all data
    await Promise.all([
      fetchLiveMatches(),
      fetchArticles(),
      fetchVideos(),
      fetchTeamRankings(),
      fetchPlayerRankings()
    ]);
    
    // Auto-refresh matches every 30 seconds
    setInterval(fetchLiveMatches, 30000);
    
  } catch (error) {
    console.error('Initialization error:', error);
    showError('Failed to load initial data. Please refresh the page.');
  }
});
// =============================================