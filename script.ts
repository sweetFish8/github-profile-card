// --- 型定義 (Interface) ---
// ユーザーデータの型を定義
interface UserData {
    login: string;
    name: string | null;
    avatar_url: string;
    html_url: string;
    bio: string | null;
    followers: number;
    following: number;
    public_repos: number;
    location: string | null;
    company: string | null;
    created_at: string;
}
// リポジトリデータの型を定義
interface RepoData {
    name: string;
    html_url: string;
    description: string | null;
    stargazers_count: number;
    forks_count: number;
}
// --- HTML要素の取得 ---
const usernameInput = document.getElementById('usernameInput') as HTMLInputElement;
const searchButton = document.getElementById('searchButton') as HTMLButtonElement;
const profileCard = document.getElementById('profileCard') as HTMLDivElement;
const loader = document.getElementById('loader') as HTMLDivElement;
// --- イベントリスナー ---
searchButton.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (username) {
        fetchUserProfile(username);
    } else {
        profileCard.innerHTML = `<p style="color: yellow;">ユーザー名を入力してください。</p>`;
    }
});
// --- メインの非同期関数 ---
async function fetchUserProfile(username: string) {
    // 検索開始時にローダーを表示し、前の結果をクリア
    loader.style.display = 'block';
    profileCard.innerHTML = '';
    try {
        // ユーザー情報とリポジトリ情報を同時に（並行して）取得
        const [userResponse, repoResponse] = await Promise.all([
            fetch(`https://api.github.com/users/${username}`),
            fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
        ]);
        if (!userResponse.ok) {
            throw new Error('ユーザーが見つかりませんでした。');
        }
        const userData: UserData = await userResponse.json();
        const repoData: RepoData[] = repoResponse.ok ? await repoResponse.json() : [];
        // 取得したデータでプロフィールカードを表示
        displayProfile(userData, repoData);
    } catch (error) {
        if (error instanceof Error) {
            profileCard.innerHTML = `<p style="color: red;">エラー: ${error.message}</p>`;
        }
    } finally {
        // 成功・失敗にかかわらず、最後にローダーを非表示にする
        loader.style.display = 'none';
    }
}
// --- 表示用関数 ---
function displayProfile(user: UserData, repos: RepoData[]) {
    // リポジトリをスター数で降順にソートし、上位5件を取得
    const topRepos = repos
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 5);
    // 日付をフォーマットする
    const createdAt = new Date(user.created_at).toLocaleDateString('ja-JP');
    const cardHTML = `
        <div class="card">
            <div class="profile-header">
                <img src="${user.avatar_url}" alt="プロフィール画像">
                <div class="info">
                    <h2>${user.name || user.login}</h2>
                    <p>@${user.login}</p>
                </div>
            </div>
            <p class="profile-bio">${user.bio || '自己紹介はありません。'}</p>
            <div class="profile-stats">
                <div class="stat">
                    <div class="value">${user.followers}</div>
                    <div class="label">フォロワー</div>
                </div>
                <div class="stat">
                    <div class="value">${user.following}</div>
                    <div class="label">フォロー中</div>
                </div>
                <div class="stat">
                    <div class="value">${user.public_repos}</div>
                    <div class="label">リポジトリ</div>
                </div>
            </div>
            <div class="profile-details">
                ${user.company ? `<p><i class="fa-solid fa-building"></i> ${user.company}</p>` : ''}
                ${user.location ? `<p><i class="fa-solid fa-location-dot"></i> ${user.location}</p>` : ''}
                <p><i class="fa-solid fa-calendar-alt"></i> GitHub参加日: ${createdAt}</p>
            </div>
            <div class="repos">
                <h3>人気のプロジェクト</h3>
                <div class="repo-list">
                    ${topRepos.map(repo => `
                        <a href="${repo.html_url}" target="_blank">
                            <strong>${repo.name}</strong>
                            <span class="repo-stats">
                                <i class="fa-solid fa-star"></i> ${repo.stargazers_count}
                                <i class="fa-solid fa-code-fork"></i> ${repo.forks_count}
                            </span>
                            <p>${repo.description || '説明はありません。'}</p>
                        </a>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    profileCard.innerHTML = cardHTML;
}
