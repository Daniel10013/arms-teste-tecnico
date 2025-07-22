import { Download, Trash2 } from 'lucide-react';
import { useState, useEffect } from "react";
import "./ArticleHistory.css";
import { downloadPDF } from '../../service/pdf';

interface Articles {
    urlTitle: string,
    title: string,
    content: string
}

function ArticleHistory() {

    const [articles, setArticles] = useState<Articles[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        loadArticles();
    }, []);

    const loadArticles = async () => {
        setIsLoading(true);

        //simulate loading
        await new Promise((resolve) => setTimeout(resolve, 500));

        const data = localStorage.getItem('artigosSalvos');
        const savedArticles = data ? JSON.parse(data) : [];

        setArticles(savedArticles);
        setIsLoading(false);
    };

    const deleteArticle = async (urlTitle: string) => {
        if(!urlTitle){
            return;
        }

        const dados = localStorage.getItem('artigosSalvos');
        if (!dados) return;

        const updatedArticles = articles.filter((artigo: any) => artigo.urlTitle !== urlTitle);
        localStorage.setItem('artigosSalvos', JSON.stringify(updatedArticles));
        return await loadArticles();
    }

    const downloadAsPDF = (urlTitle: string): void => {
        const article = articles.find((artigo: any) => artigo.urlTitle === urlTitle) || null;
        if(article == null){
            return;
        }
        return downloadPDF(article.title, article.content);
    }

    return (
        <>
            <h1 style={{ marginTop: "60px" }}>
                Histórico de Artigos
            </h1>
            <h2>
                Lembre-se que o histórico mantém os seus artigos apenas por um tempo!
            </h2>
            <div className="table-header">
                <div className="htitle">Título</div>
                <div className="hoptions">Opções</div>
            </div>
            {isLoading == true && (
                <div className="tableLoader">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="skeleton">
                            {""}
                        </div>
                    ))}
                </div>
            )}
            {isLoading == false ?
            articles.length == 0 ? 
                (
                    <div className="empty" >Nenhum artigo salvo ainda!</div>
                )
                :
                
                    articles.map((article, index) => (
                        <>
                            <div className={"table-row desktop"} key={index}>
                                <div className="row-title">{article.title}</div>
                                <div className="row-options">
                                    <button className="del" onClick={()=>{deleteArticle(article.urlTitle)}}>
                                        <Trash2 size={20} className='icon' />
                                    </button>
                                    <button className="download" onClick={()=>{downloadAsPDF(article.urlTitle)}}>
                                        <Download size={20} className='icon'/>
                                    </button>
                                </div>
                            </div>
                            <div className={"table-row mobile"} key={index}>
                                <div className="row-title"><span style={{color: "rgb(117, 30, 216)", marginRight: "2px"}}>Titulo: </span>{article.title}</div>
                                <div className="row-options">
                                    <button className="del" onClick={()=>{deleteArticle(article.urlTitle)}}>
                                        <Trash2 size={20} className='icon'/>
                                    </button>
                                    <button className="download" onClick={()=>{downloadAsPDF(article.urlTitle)}} >
                                        <Download size={20} className='icon'/>
                                    </button>
                                </div>
                            </div>
                        </>
                        
                    ))
            : (<></>)}
        </>
    )
}

export default ArticleHistory;