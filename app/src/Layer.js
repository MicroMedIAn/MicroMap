import React, {
  useEffect,
  useState
} from "react";
import { Annotation } from './Annotation';
import { IdDialog } from './IdDialog';


const gdate = () => {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  const yyyy = today.getFullYear();

  return dd + '/' + mm + '/' + yyyy;
}


const guid = () => {
    const s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}


const rel2abs = (poly, dims) => {
  const listPoints = poly.map((pt) => {
      return(
        {
          x: pt.x * dims.width / 100,
          y: pt.y * dims.height / 100
        }
      );
    }
  );
  return listPoints;
}

const annotationsToShapeList = (annotObjects) => {
  const listOfShapes = Object.entries(annotObjects).map((data, idx) => {
    const annot = data[1];
    // console.log("data from request: ", annot);
    if (annot === null){
      return [];
    }
    else if (annot.hasOwnProperty('points')){
      // console.log("had property points !!!");
      return annot;
    } else {
      return [];
    }
  });
  return listOfShapes;
}

const LayerTest = ({drawing, color, label, pos, send, request, remove}) => {

  const [isDrawing, setIsDrawing] = useState(false);
  const [shapeList, setShapeList] = useState([]);
  const [currentShape, setCurrentShape] = useState([]);
  const [hasNewShapes, setHasNewShapes] = useState(false);
  const [idOpen, setIdOpen] = useState(false);

  const removeAnnot = (annot) => {
    const annotations = shapeList.filter(item => item.id !== annot.id);
    setShapeList(annotations);
    remove(annot);
  }

  const pointsToAnnotationObj = (points) => {
    const new_idx = guid();
    const date = gdate();
    return {
      points: points,
      id: new_idx,
      author: "anonymous",
      text: "",
      label: label,
      color: color,
      date: date
    };
  }

  const pointsToNamedAnnotationObj = (points, name) => {
    const new_idx = guid();
    const date = gdate();
    return {
      points: points,
      id: new_idx,
      author: name,
      text: "",
      label: label,
      color: color,
      date: date
    };
  }

  const pointsToFlyingAnnotationComponent = (points) => {
    return {
      points: rel2abs(points, pos),
      id: "",
      author: "anonymous",
      text: "",
      label: label,
      color: color,
      date: ""
    };
  }

  const annotToAnnotationComponent = (annot) => {
    // console.log("annot2component: ", annot);
    return {
      points: rel2abs(annot.points, pos),
      id: annot.id,
      author: annot.author,
      text: annot.text,
      label: annot.label,
      color: annot.color,
      date: annot.date
    };
  }

  useEffect(() => {
    const getShapeList = async () => {
      const response = await request();
      let srv_annot = await response.data;
      // console.log("requested annotations: ", srv_annot);
      setShapeList(annotationsToShapeList(srv_annot.shapes));
    }
    if (hasNewShapes === false){
      getShapeList();
    }
  }, [hasNewShapes, request]);

  const createNewNamedAnnot = (name) => {
    const annotobj = pointsToNamedAnnotationObj(currentShape, name);
    const updatedAnnotations = shapeList.slice();
    updatedAnnotations.push(annotobj);
    setShapeList(updatedAnnotations);
    send(annotobj);
    setHasNewShapes(true);
    setCurrentShape([]);
  }

  const annotationList = (elements, flying) => {
    const listItems = elements.map((annot, idx) => {
        return(
          <Annotation
            shape={annotToAnnotationComponent(annot)}
            status="written"
            remove={removeAnnot}
            key={annot.id}
          />
        );
      }
    );
    if (flying.length > 0){
      listItems.push(
        <Annotation
          shape={pointsToFlyingAnnotationComponent(flying)}
          status="flying"
          remove={removeAnnot}
          key={elements.length}
        />
      );
    }
    if (idOpen) {
      listItems.push(
        <IdDialog
          trigger={createNewNamedAnnot}
          keepOpen={setIdOpen}
          opened={idOpen}
          />
      );
    }
    return listItems;
  }

  const addPoint = (evt) => {
    const container = {
      x: pos.left,
      y: pos.top,
      width: pos.width,
      height: pos.height
    }
    const scr = {
      x: evt.pageX,
      y: evt.pageY
    };
    const svgPosition = {
      x: 100 * (scr.x - container.x) / container.width,
      y: 100 * (scr.y - container.y) / container.height,
      status: "written"
    }
    const updatedShape = currentShape.slice();
    if (updatedShape.length > 0) {
      if (updatedShape[updatedShape.length - 1].status === "flying") {
        updatedShape.pop();
      }
      updatedShape.push(svgPosition);
      setCurrentShape(updatedShape);
    }
    else {
      updatedShape.push(svgPosition);
      setCurrentShape(updatedShape);
    }
  }

  const replaceLastPoint = (evt) => {
    const container = {
      x: pos.left,
      y: pos.top,
      width: pos.width,
      height: pos.height
    }
    const scr = {
      x: evt.pageX,
      y: evt.pageY
    };
    const svgPosition = {
      x: 100 * (scr.x - container.x) / container.width,
      y: 100 * (scr.y - container.y) / container.height,
      status: "flying"
    }
    const updatedShape = currentShape.slice();
    if (updatedShape[updatedShape.length - 1].status === "flying") {
      updatedShape.pop();
    }
    updatedShape.push(svgPosition);
    setCurrentShape(updatedShape);
    // console.log(updatedShape);
  }


  const handleClick = (evt) => {
    if (isDrawing === true) {
      addPoint(evt);
    } else if (idOpen === false) {
      setIsDrawing(true);
      addPoint(evt);
    }
  }

  const handleMove = (evt) => {
    if (isDrawing === true && currentShape.length > 1) {
      replaceLastPoint(evt);
    }
  }

  const handleKeyDown = (evt) => {
    if (isDrawing && evt.key === 'Enter') {
      setIsDrawing(false);
      console.log("Finished current shape!", currentShape);
      // before pushing anything to the list of annotation, we
      // have to format the annotation
      const annotobj = pointsToAnnotationObj(currentShape);
      const updatedAnnotations = shapeList.slice();
      updatedAnnotations.push(annotobj);
      setShapeList(updatedAnnotations);
      send(annotobj);
      setHasNewShapes(true);
      setCurrentShape([]);
    }
  }

  // const handleContextMenu = (evt) => {
  //   evt.preventDefault();
  //   if (isDrawing && (currentShape.length > 0)) {
  //     setIsDrawing(false);
  //     // console.log("Finished current shape!", currentShape);
  //     // before pushing anything to the list of annotation, we
  //     // have to format the annotation
  //     const annotobj = pointsToAnnotationObj(currentShape);
  //     const updatedAnnotations = shapeList.slice();
  //     updatedAnnotations.push(annotobj);
  //     setShapeList(updatedAnnotations);
  //     send(annotobj);
  //     setHasNewShapes(true);
  //     setCurrentShape([]);
  //   }
  // }

  const handleContextMenu = (evt) => {
    evt.preventDefault();
    if (isDrawing && (currentShape.length > 0)) {
      setIsDrawing(false);
      // console.log("Finished current shape!", currentShape);
      // before pushing anything to the list of annotation, we
      // have to format the annotation
      setIdOpen(true);
    }
  }

  const viewBoxFormat = (dimensions) => {
    return ("0 0 " + dimensions.width.toString() + " " + dimensions.height.toString());
  }

  return(
    <svg
        id="annotationOverlay"
        className="overlay"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        viewBox={viewBoxFormat(pos)}
        overflow="hidden"
        width="100%"
        height="100%"
        style={drawing}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onMouseMove={handleMove}
        onContextMenu={handleContextMenu}
        tabIndex="0"
      >
      {annotationList(shapeList, currentShape)}
    </svg>

  );

}

export {
  LayerTest
};
