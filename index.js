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

export const run2 = async () => {
    try{
         const chat  =  new  OpenAI({ modelName:"gpt-3.5-turbo" ,  temperature: 0.9})
         const  response = await chat.call([
            new SystemChatMessage(
                "คุณคือพนักงานขาย สินค้าหมวดหมู่มือถือ ให้คำตอบเฉพาะสินค้ามือถือเท่านั้น"
            ),
            new HumanChatMessage("iphone")
         ])
         console.log(response)
    }catch(ex){
        console.log(ex)
    }
}


//loads data from text files
export const run33 = async () => {
  const loader = new TextLoader(
    "example.txt"
  );
  const docs = await loader.load();
  // console.log({ docs });

  try{
    // const chain =  new  OpenAI({ temperature: 0.9})
    const model = new OpenAI({
                            modelName:"gpt-3.5-turbo" ,
                            });



    console.log("model" , model)


    const chatPrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(
        "You are a helpful assistant that translates"
      ),
      HumanMessagePromptTemplate.fromTemplate("{text}"),
    ]);

    // question and answer chain
   const chain = loadQAChain(model);
   console.log("chain", chain)
//     //console.log(chain)
    const res = await chain.call({
      input_documents: docs,
      //question: "ขายที่ไหน",
      prompt: chatPrompt,
    });

//     console.log({ res });
 }catch(ex){


   console.log(ex)
}


};

export const run = async  () => {

  // We can also construct an LLMChain from a ChatPromptTemplate and a chat model.
  const chat = new ChatOpenAI({  modelName:"gpt-3.5-turbo" , temperature: 0 });
  const chatPrompt = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
      "คุณคือพนักงานขาย ที่เชี่ยวชาญการขายสินค้า ตอบคำถามอย่างสุภาพ ตอบคำถามลงท้ายด้วยค่ะเสมอ เชียวชาญด้านการใช้ภาษาไทย ทำการเรียบเรียงข้อความใหม่ให้สุภาพและเข้าใจง่ายสำหรับลูกค้า ถ้ามีการสัั่งซื้อ ให้ส่ง url ของ  website"
     //"คุณคือผู้เชียวชาญด้านการใช้ภาษาไทย ทำการเรียบเรียงข้อความใหม่ให้สุภาพและเข้าใจง่ายสำหรับลูกค้า"
     ),
    HumanMessagePromptTemplate.fromTemplate("{question}"),
  ]);


  const loader = new TextLoader(
    "example.txt"
  );
  const docs = await loader.load();


  const chainB = new LLMChain({
    llm: chat,
    prompt:chatPrompt
  });





  // console.log("chainB", chainB)

  const model = new ChatOpenAI({
    modelName:"gpt-3.5-turbo" ,
    temperature: 0.7,
    });

    // console.log("model" , model)

  const chain = loadQAChain(model);


//  console.log("chain", chain)

   const q =  'ขายอะไรครับ'
  const resB = await chain.call({
    input_documents: docs,
    question : q ,
  });

   console.log( resB.text );


  const  ans  = await chainB.call({
    question :  q + resB.text
  })
  console.log(ans)



//   try{
//     const chat2 =  new  OpenAI({ modelName:"gpt-3.5-turbo" ,  temperature: 0.9})
//     const  response = await chat2.call([
//        new SystemChatMessage(
//            "คุณคือนักแปรภาษาไทยเป็นอังกฤษ"
//        ),
//        new HumanChatMessage("ดี")
//     ])
//     console.log(response)
// }catch(ex){
//    console.log(ex)
// }



}




  run();
