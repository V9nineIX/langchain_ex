  //Import the OpenAPI Large Language Model (you can import other models here eg. Cohere)
  import { OpenAI  } from 'langchain/llms/openai';
  import { ChatOpenAI } from 'langchain/chat_models/openai'
  import { HumanChatMessage , SystemChatMessage  } from 'langchain/schema'
  //Load environment variables (populate process.env from .env file)
  import * as dotenv from "dotenv";
  import { TextLoader } from "langchain/document_loaders/fs/text";
  import { loadQAChain } from "langchain/chains";
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

export const run2= async () => {
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
export const run = async () => {
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
    // question and answer chain
   const chain = loadQAChain(model);
   console.log("chain", chain)
//     //console.log(chain)
//     const res = await chain.call({
//       input_documents: docs,
//       question: "ขายที่ไหน",
//     });

//     console.log({ res });
 }catch(ex){


   console.log(ex)
}


};






  run();
