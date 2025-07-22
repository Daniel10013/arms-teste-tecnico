import { useState } from "react";
import { FileText } from 'lucide-react';
import { generateArticleAI } from "../../service/ai";
import { downloadPDF } from "../../service/pdf";
import "./CreateArticles.css";

function CreateArticle() {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasSaved, setHasSaved] = useState<boolean>(false);

    //data to create article
    const [articleSource, setArticleSource] = useState<string>('');
    const [articleTone, setArticleTone] = useState<string>('');
    //error message
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [hasError, setHasError] = useState<boolean>(true);
    //success message 
    const [successMessage, setSuccessMessage] = useState<string>('')

    //created article data
    const [generatedArticle, setGeneratedArticle] = useState<string>('');
    const [availableTitles, setAvailableTitles] = useState<string[]>([]);
    const [selectedTitleBox, setSelectedTitleBox] = useState<number>(0);
    const [selectedTitle, setSelectedTitle] = useState<string>('');

    const handleSelectTitle = (selectedBox: number, titleText?: string) => {
        setSelectedTitleBox(selectedBox);
        setSelectedTitle(titleText ? titleText : '');
    };

    const generateArticle = async () => {
        try {
            if (articleSource == '' || articleTone == '') {
                return setErrorMessage('Preencha todos os campos corretamente!');
            }
            //remove error message
            setErrorMessage('');
            setHasError(false);
            setIsLoading(true)
            const generatedData = await generateArticleAI(articleSource, articleTone);
            console.log(generatedData)
            setGeneratedArticle(generatedData.article);
            setAvailableTitles(generatedData.title);
        }
        catch (e: any) {
            setErrorMessage(e.message);
            setHasError(true);
        }
        finally {
            setIsLoading(false);
            setHasSaved(false);
        }
    }

    const saveOnHistory = () => {
        if (hasSaved == true) {
            setSuccessMessage('Artigo já está salvo histórico!');
            setTimeout(() => {
                setSuccessMessage('');
            }, 1500);
            return;
        }
        if (!selectedTitle || !generatedArticle) {
            return setErrorMessage('Título não selecionado ou artigo vazio. Salvamento cancelado.');
        }

        setHasSaved(true);
        const urlTitle = selectedTitle
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .trim()
            .replace(/\s+/g, '-');

        const articleToSave = {
            urlTitle: urlTitle,
            title: selectedTitle,
            content: generatedArticle,
            savedAt: new Date().toISOString(),
        };

        const local = localStorage.getItem('artigosSalvos');
        const localData: typeof articleToSave[] = local ? JSON.parse(local) : [];

        localData.push(articleToSave);
        localStorage.setItem('artigosSalvos', JSON.stringify(localData));

        setErrorMessage('');
        setSuccessMessage('Artigo salvo no histórico!');
        setTimeout(() => {
            setSuccessMessage('');
        }, 1500);
    }

    const donwloadAsPdf = () => {
        if (!selectedTitle || !generatedArticle) {
            return setErrorMessage('Título ou conteúdo ausente para o PDF.');
        }
        downloadPDF(selectedTitle, generatedArticle);
        setErrorMessage('');
    }

    return (
        <section>
            <h1>Criação de Artigos</h1>
            <h2>Aqui você consegue gerar os artigos e escolher</h2>
            <div className="article-info">
                <input type="text" placeholder="Digite o tema ou sugestão de título que você deseja" onChange={(event) => setArticleSource(event.target.value)} />
                <select
                    value={articleTone}
                    onChange={(e) => setArticleTone(e.target.value)}
                >
                    <option value="">Selecione o tom do texto</option>
                    <option value="informal">Informal</option>
                    <option value="tecnico">Técnico</option>
                    <option value="persuasivo">Persuasivo</option>
                </select>
                <button onClick={generateArticle}>Gerar Artigo</button>
            </div>
            <div className="message-div">
                <h3 style={{ color: "rgb(228, 37, 37)" }}>{errorMessage}</h3>
                <h3 style={{ color: "green" }}>{successMessage}</h3>
            </div>
            {isLoading == false && hasError == false && (
                <div className="article-content">
                    <div className="content-box">
                        <h3>Selecione o Título</h3>
                        <div className="select-title">
                            <div className={`title-to-select ${selectedTitleBox === 1 ? 'selected-title' : ''}`} onClick={() => { handleSelectTitle(1, availableTitles[0]) }}>
                                {availableTitles[0]}
                            </div>
                            <div className={`title-to-select ${selectedTitleBox === 2 ? 'selected-title' : ''}`} onClick={() => { handleSelectTitle(2, availableTitles[1]) }}>
                                {availableTitles[1]}
                            </div>
                            <div className={`title-to-select ${selectedTitleBox === 3 ? 'selected-title' : ''}`} onClick={() => { handleSelectTitle(3, availableTitles[2]) }}>
                                {availableTitles[2]}
                            </div>
                        </div>
                        <h3 style={{ marginTop: "40px" }}>Mais Opções</h3>
                        <div className="options-buttons">
                            <button className="download-pdf" onClick={donwloadAsPdf}>
                                <FileText size={18} style={{ marginRight: '8px' }} />
                                Baixar em PDF
                            </button>
                            <button className="save-article" onClick={saveOnHistory}>
                                Salvar no histórico
                            </button>
                        </div>
                    </div>
                    <div className="content-box" style={{ alignItems: "flex-start", justifyContent: "flex-start", gap: "10px" }}>
                        <h3>Texto do artigo:</h3>
                        <div className="article-text">
                            {generatedArticle}
                        </div>
                    </div>
                </div>
            )}
            {isLoading == true && (
                <div className="loader">
                    <div className="spinner-container">
                        <div className="spinner"></div>
                    </div>
                    <h3>Carregando...</h3>
                </div>
            )}
        </section>
    )
}

export default CreateArticle;