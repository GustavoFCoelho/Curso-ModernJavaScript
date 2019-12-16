class GitHub{
    constructor(){
        this.client_id = 'd9308aacf8b204d361fd';
        this.client_secret = '84969aeef73956f4ec9e8716d1840532802bb81b';
        this.repos_sort = "create: asc"
    }

    async getUser(user){
        const profileResponse = await fetch(`https://api.github.com/users/${user}?client_id=${this.client_id}&client_secrete=${this.client_secret}`);

        const reposResponse = await fetch(`https://api.github.com/users/${user}/repos?sort=${this.repos_sort}&client_id=${this.client_id}&client_secret=${this.client_secret}`);

        const profile = await profileResponse.json();
        const repos = await reposResponse.json();

        return{
            profile,
            repos
        }
    }
}