  //Import the OpenAPI Large Language Model (you can import other models here eg. Cohere)
  import { OpenAI  } from 'langchain/llms/openai';
  import { ChatOpenAI } from 'langchain/chat_models/openai'
  import { HumanChatMessage , SystemChatMessage  } from 'langchain/schema'
  //Load environment variables (populate process.env from .env file)
  import * as dotenv from "dotenv";
  import { TextLoader } from "langchain/document_loaders/fs/text";
  import { loadQAChain } from "langchain/chains";

  import {
    ChatPromptTemplate,
    HumanMessagePromptTemplate,
    PromptTemplate,
    SystemMessagePromptTemplate,
  } from "langchain/prompts";
  

  import { LLMChain } from "langchain/chains";
  import { ConversationalRetrievalQAChain } from "langchain/chains";
  import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
  import { HNSWLib } from "langchain/vectorstores/hnswlib";
  import { OpenAIEmbeddings } from "langchain/embeddings/openai";

  import * as fs from "fs";
  



  dotenv.config();

//   export const run = async () => {
//      try {
//       //Instantiante the OpenAI model
//       //Pass the "temperature" parameter which controls the RANDOMNESS of the model's output. A lower temperature will result in more predictable output, while a higher temperature will result in more random output. The temperature parameter is set between 0 and 1, with 0 being the most predictable and 1 being the most random
//       const model = new OpenAI({
//         modelName:"gpt-3.5-turbo",
//         temperature: 0.9 });
//     //   const model = new OpenAI({ openAIApiKey: "sk-NwpX0BjlOmMrJBZIx5urT3BlbkFJ2wVJD8qKhXdyTXyOf",
//     //                              temperature: 0.9 });

//       console.log(model)

//       //Calls out to the model's (OpenAI's) endpoint passing the prompt. This call returns a string
//       const res = await model.call(
//           "หวัดดี"
//       );

//       console.log({ res });
//      }catch(ex){
//         console.log("ex" ,ex)
//      }
//   };



export const run2 = async  () => {

  // We can also construct an LLMChain from a ChatPromptTemplate and a chat model.
//   const chat = new ChatOpenAI({  modelName:"gpt-3.5-turbo" , temperature: 0 });
//   const chatPrompt = ChatPromptTemplate.fromPromptMessages([
//     SystemMessagePromptTemplate.fromTemplate(
//       `คุณคือพนักงานขาย ที่เชี่ยวชาญการขายสินค้า ตอบคำถามอย่างสุภาพ ตอบคำถามลงท้ายด้วยค่ะเสมอ 
//        เชียวชาญด้านการใช้ภาษาไทย ทำการเรียบเรียงข้อความใหม่ให้สุภาพและเข้าใจง่ายสำหรับลูกค้า 
//        ถ้ามีการสัั่งซื้อ ให้ส่ง url ของ  website  ตามคำถามโดยใช้ข้อมูลจาก {info}
//        `
//      ),
//     HumanMessagePromptTemplate.fromTemplate("{info}{question}"),
//   ]);


//   const chainB = new LLMChain({
//     llm: chat,
//     prompt:chatPrompt
//   });

  const loader = new TextLoader(
    "example.txt"
  );
  const docs = await loader.load();


  const model = new ChatOpenAI({
    modelName:"gpt-3.5-turbo" ,
    temperature: 0,
    });

    // console.log("model" , model)

  const chain = loadQAChain(model);

 // console.log("chain", chain)

  const q1 = 'ขายอะไร'

  const q =  `Question: ${q1} ใช้คำถามนี้ คุณคือพนักงานขาย ตอบคำถามในแบบพนักงานขาย ที่เชี่ยวชาญการขายสินค้า ตอบคำถามอย่างสุภาพ ตอบคำถามลงท้ายด้วยค่ะเสมอ 
    ทำการเรียบเรียงข้อความให้สุภาพและเข้าใจง่ายสำหรับลูกค้า ให้เรียกแทนตัวเองด้วยเรา ให้เรียกแทนผู้ถามว่าคุณลูกค้า Helpful Answer:'
   `

  const resB = await chain.call({
    input_documents: docs,
    question : q ,
  });

   console.log( resB.text );


//   const  ans  = await chainB.call({
//     question :  q1 ,
//     info : resB.text
//   })
//   console.log(ans)

}

const getPrompt = (question) => {
  return  `Question: ${question} ใช้คำถามนี้ คุณคือพนักงานขาย ตอบคำถามในแบบพนักงานขาย ที่เชี่ยวชาญการขายสินค้า ตอบคำถามอย่างสุภาพ ตอบคำถามลงท้ายด้วยค่ะเสมอ 
  ทำการเรียบเรียงข้อความให้สุภาพและเข้าใจง่ายสำหรับลูกค้า ให้เรียกแทนตัวเองด้วยเรา ให้เรียกแทนผู้ถามว่าคุณลูกค้า ตอบข้อความเป็นภาษาไทย Helpful Answer:'
 `
}

export const run = async () => {
    /* Initialize the LLM to use to answer the question */
    // const model = new OpenAI({});

    const model = new ChatOpenAI({
        modelName:"gpt-3.5-turbo" ,
        temperature: 0,
    });

    /* Load in the file we want to do question answering over */
    const text = fs.readFileSync("example.txt", "utf8");
    /* Split the text into chunks */
    const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });

    const docs = await textSplitter.createDocuments([text]);
    // /* Create the vectorstore */
      const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());

    // /* Create the chain */
    const chain = ConversationalRetrievalQAChain.fromLLM(
      model,
      vectorStore.asRetriever(),
      {
        questionGeneratorTemplate:'คุณคือพนักงานขาย ตอบคำถามในแบบพนักงานขาย ที่เชี่ยวชาญการขายสินค้า ตอบคำถามอย่างสุภาพ ตอบคำถามลงท้ายด้วยค่ะเสมอ\n' +
        'ทำการเรียบเรียงข้อความให้สุภาพและเข้าใจง่ายสำหรับลูกค้า\n' +
        'ตอบข้อความเป็นภาษาไทย ติดตามการสนทนาต่อไปนี้และติดตามคำถาม\n' +
          'ประวัติการสนทนา:\n' +
          '{chat_history}\n' +
          'Question: {question}\n'+ 
          'ไม่มีพยามตอบคำถามที่ไม่มีข้อมูล'
      }
    //   {
    //     questionGeneratorTemplate:'คุณคือพนักงานขาย ตอบคำถามในแบบพนักงานขาย ที่เชี่ยวชาญการขายสินค้า ตอบคำถามอย่างสุภาพ ตอบคำถามลงท้ายด้วยค่ะเสมอ\n' +
    //     'ทำการเรียบเรียงข้อความให้สุภาพและเข้าใจง่ายสำหรับลูกค้า\n'
    //   }
    );


    //    'Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.\n' +
    //     '\n' +
    //     'Chat History:\n' +
    //     '{chat_history}\n' +
    //     'Follow Up Input: {question}\n' +
    //     'Standalone question:',

 console.log("chain",chain)

    /* Ask it a question */
    const question = "ราคาเท่าไหร่";

    // const prompt = getPrompt( question )

    // console.log("prompt", prompt)

    const res = await chain.call({ question , chat_history: [] });
    console.log(res);
    /* Ask it a follow up question */
    const chatHistory =   question + res.text;
   // console.log("chatHistory" , question + res.text)

    const question2 = "ขายอะไร";
    const prompt2 =  getPrompt(question2)
    console.log(" prompt2 " ,prompt2)

    const followUpRes = await chain.call({
      question:   prompt2  ,
      chat_history: [],
    });

     console.log(followUpRes);

  };




  run();
