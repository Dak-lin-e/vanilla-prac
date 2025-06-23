
function displayUserInfo(user) {
    // 프로필 이미지
    const profileImg = document.querySelector('img'); // 프로필 이미지 요소
    profileImg.src = user.avatar_url;
    
    // 사용자 정보 표시
    const information = document.querySelectorAll('.descriptions h4')
    information[0].textContent = `Company:${user.company}`
    information[1].textContent = `Blog/Website:${user.blog}`
    information[2].textContent = `Location:${user.location}`
    information[3].textContent = `Since:${new Date(user.created_at).toLocaleDateString()}`
    
        new Date(user.created_at).toLocaleDateString();
    
    // 통계 정보 업데이트
    updateStats(user);
}

function updateStats(user) {
    const button = document.querySelectorAll('.information .buttons button')
    // Public Repos, Gists, Followers, Following 정보 업데이트
        button[0].textContent = `Repos:${user.pulbic_Repos}`
        button[1].textContent = `Gists:${user.pulbic_gists}`
        button[2].textContent = `Followers:${user.followers}`
        button[3].textContent = `Following:${user.following}`
   
    get_repos(user);
}

async function get_repos(user){

    try {
        const response_repo=await fetch(user.repos_url)
        const repos= await response_repo.json()
        console.log(repos)
        display_repos(repos)
    } catch (error) {
        console.error(error)
    }

}
function display_repos(repos) {
    // id="repos"인 div에만 내용 추가 (HTML에 이미 있음)
    const reposDiv = document.querySelector('.repos');
    reposDiv.innerHTML = ''; // 기존 내용 지우기

    if (!Array.isArray(repos) || repos.length === 0) {
        reposDiv.innerHTML = '<p>No repositories found.</p>';
        return;
    }

    for (let i = 0; i < repos.length; i++) {
        const repo_n = document.createElement('div');
        repo_n.className = 'repo-item'; // id 대신 class 사용
        repo_n.innerHTML = `
            <h5 class="repo_name" style="color:rgb(106, 168, 243);">${repos[i].name}</h5>
            <div class="repobutton">
                <button class="button1" style="background-color:rgb(106, 168, 243);">Stars: ${repos[i].stargazers_count}</button>
                <button class="button2" style="background-color: gray;">Watchers: ${repos[i].watchers_count}</button>
                <button class="button3" style="background-color: rgb(16, 201, 16)">Forks: ${repos[i].forks_count}</button>
            </div>
        `;
        reposDiv.appendChild(repo_n);
    }
}


class GitHubFinder {
    constructor() {
        this.init();
    }
    
    init() {
        const searchForm = document.querySelector('.search form');
        const searchInput = document.querySelector('.search input[type="text"]');
        
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = searchInput.value.trim();
            if (username) {
                this.searchUser(username);
            }
        });
    }
    
    async searchUser(username) {
        try {
            const response = await fetch(`https://api.github.com/users/${username}`);
            
            if (response.ok) {
                const user = await response.json();
                this.displayUser(user);
                displayUserInfo(user)
            } else {
                this.showError('사용자를 찾을 수 없습니다.');
            }
        } catch (error) {
            this.showError(error);
        }
    }
    
    displayUser(user) {
        // 여기에 DOM 업데이트 로직 추가
        console.log(user); // 먼저 콘솔에서 확인
    }
    
    showError(message) {
        alert(message); // 또는 적절한 에러 표시 방법
    }
    

}

// 앱 초기화
new GitHubFinder();
