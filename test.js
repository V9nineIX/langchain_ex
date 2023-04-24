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