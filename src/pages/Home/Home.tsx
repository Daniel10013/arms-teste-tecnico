import ArticleHistory from "../../components/ArticleHistory/ArticleHistory";
import "./Home.css";


function Home() {
    return (
        <section>
            <h1>Gerador de Artigos automático!</h1>
            <h2>No nosso site você consegue gerar artigos de forma simples e rápida com poucos toques!</h2>
            <ArticleHistory />
        </section>
    )
}

export default Home;