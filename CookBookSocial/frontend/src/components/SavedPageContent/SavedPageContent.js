import React, { useEffect, useState,Component } from "react";
import {Tabs, TabList, Tab, DragTabList, DragTab, PanelList, Panel, ExtraButton} from 'react-tabtab';
import customStyle from './SavedPageTabs';
import RecipePost from "../../components/recipe_posts/RecipePost";
import {simpleSwitch} from 'react-tabtab/lib/helpers/move';
import DraggableList from "react-draggable-list";
import styled from "styled-components";


//Assuming maxed file we can save is 10. Assuming each user have 10 saved file in the database. 




//generate initial data


function SavedPageContent () {
  const GetSavedRecipesByIndex = (index =0) =>{
    const [savedRecipePostsList, updateSavedRecipePostsList] = useState([]);
    
    /*
    This will fetch the list of Saved recipe posts stored in the database. each saved file is related by "key" 
    as an array of json objects. It will then save it in the state variable AllrecipePostsList.
    It will refresh and check for new posts everytime the page refreshes.
    "URL_GET_RECIPE_POSTS_DATA" will be replaced by the actual api endpoint for GET once it is created by
    the backend.
    */
  
  
    
    //change api to get data of saved file with "file index"(fix here)
    //change api like "/api/recipe/saved(index)"
    const URL_GET_SAVED_RECIPE_POSTS_DATA = "/api/recipe/all";
    
      useEffect(() => {
        fetch(URL_GET_SAVED_RECIPE_POSTS_DATA)
          .then((response) => response.json())
          .then((data) => updateSavedRecipePostsList(data));
      }, []);
  
  
    const arrComponents = [];
    for (let i = 0; i < savedRecipePostsList.length; i++) {
      arrComponents.unshift(
        {key :i, email:savedRecipePostsList[i].email, title:savedRecipePostsList[i].title, image: savedRecipePostsList[i].image, description:savedRecipePostsList[i].description,ingredient:savedRecipePostsList[i].ingredients,instruction: savedRecipePostsList[i].instructions}
      );
    }
    console.log(arrComponents)
    return(
      arrComponents
    )
    
  }

  const MakeData = () => {
    //const [savedArrComponents,updateSavedArrComponents] = useState([]);
    //savedArrComponents[number] = GetSavedRecipesByIndex(number);
    const number = 1;
    const fileTitlePrefix ='initial';
    const initialData = [];
    //get all data
    for (let i = 0; i < number; i++) {
      initialData.push({
        fileTitle: `${fileTitlePrefix} ${i}`,
        content:
        null
      });    

    }
   
    //delete data which fileTitle is null
    const data = initialData.filter((data) => (data.fileTitle !== ''))
    console.log(data);
    return data;
  }


  const GetTest = () =>{
    const temp = [];
    for(let i  =0; i< 3;i++){
      temp.push({key :i, email:"testmail"+i, title:"testTitle"+i, image: null, description:"desc"+i,ingredient:null,instruction: null});
    }
    

    return(temp);
    
  }

  const [showExtra, setshowExtra] = useState(false);
  const [showArrow, setshowArrow] = useState(true);
  const [showModal, setshowModal] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [tabs, setTabs] = useState(MakeData());
  const [savedRecipePostsList, updateSavedRecipePostsList] = useState(GetTest());
  const [newFileName, setNewFileName] = useState();




  //tap tab
  const handleTabChange = (index) => {
    setActiveIndex(index);
  }




  //handle switch tabs
  const handleTabSequenceChange = ({oldIndex, newIndex})=> {
    const updateTabs = simpleSwitch(tabs, oldIndex, newIndex);
    setTabs(updateTabs);
    setActiveIndex(newIndex)
    //swich a file in databse(fix here)
    
  }



  //add new file 
  const handleExtraButton = () => {
    if ( newFileName != ""){
      const newTabs = [...tabs, addNewTab()];
      setTabs(newTabs);
      setActiveIndex(newTabs.length - 1)
    }
    else
    {
      console.log("new file name is null")
    }
  }

  const addNewTab =()=> {
    const tempFileName = newFileName;
    setNewFileName('');
    return (
      {fileTitle: tempFileName,
        content: 
          null
        
      }
    )  
  }

  //control tab and tab's contents
  const handleEdit = ({type, index}) => {
    if (type === 'delete') {
      setTabs([...tabs.slice(0, index), ...tabs.slice(index + 1)]);
    }
    if (index - 1 >= 0) {
      setActiveIndex(index - 1);
    } else {
      setActiveIndex(0);
    }
    return {tabs, activeIndex};
  }

    

  const handleToggleExtra = e => {
    setshowExtra(showExtra);
  }
  const handleToggleArrow = e => {
    setshowArrow(showArrow);
  }
  const handleToggleModal = e => {
    setshowArrow(showModal);
  }

  console.log("time")
  console.log(savedRecipePostsList[0].length)
  const tabTemplate = [];
  const panelTemplate = [];
  //convert data to html style
  const styledSavedFile= [];
  for(let i = 0; i< savedRecipePostsList.length; i++)
  {
      for(let j = 0; j<savedRecipePostsList[i].length;j++)
      {
        styledSavedFile[i].push(
          <RecipePost
          key={j}
          email={savedRecipePostsList[i][j].email}
          title={savedRecipePostsList[i][j].title}
          image={savedRecipePostsList[i][j].image}
          description={savedRecipePostsList[i][j].description}
          ingredients={savedRecipePostsList[i][j].ingredients}
          instructions={savedRecipePostsList[i][j].instructions}
        />
        )
      }
  }
  console.log(styledSavedFile)
  tabs.forEach((tab, i) => {
    const closable = tabs.length > 1;
    tabTemplate.push(<DragTab key={i} closable={closable}>{tab.fileTitle}</DragTab>);
    panelTemplate.push(
      <Panel key={i}>
            {
              styledSavedFile[0]
            }
      </Panel>
      );
  })

  return (
    <>
    <div>
      <input
        className="inputNewFileName"
        value={newFileName}
        onChange={(event) => setNewFileName(event.target.value)}
        placeholder="Add New File"
      />
      <button onClick={handleExtraButton}>
        +
      </button>
    </div>
    <Tabs onTabEdit={handleEdit}
            onTabChange={handleTabChange}
            activeIndex={activeIndex}
            customStyle={customStyle}
            onTabSequenceChange={handleTabSequenceChange}
            showArrowButton={showArrow}
            showModalButton={showModal}
            ExtraButton={showExtra &&
              <ExtraButton onClick={this.handleExtraButton}>
                
              </ExtraButton>
            }
    >
      <DragTabList>
        {tabTemplate}
      </DragTabList>
      <PanelList>
        {panelTemplate}
      </PanelList>
    </Tabs>
    </>
  )
  
}


// export default function App() {
//   const [items, setItems] = useState(["Item 1", "Item 2", "Item 3"]);
//   return (
//     <>
    // <List
    //   values={items}
    //   onChange={({ oldIndex, newIndex }) =>
    //     setItems(arrayMove(items, oldIndex, newIndex))
    //   }
    //   renderList={({ children, props }) => <ul {...props}>{children}</ul>}
    //   renderItem={({ value, props }) => <li {...props}>{value}</li>}
    // />
//     <button onClick={()=> {console.log(items)}}></button>
//     </>
//   );
// }



export default SavedPageContent;