class Panel{
  constructor(){
    this.scale= 0;
    this.angle =0;
  }
  draw(){
    context.fillStyle='rgba(255,255,0,0.7)';
    //변환 초기화
    context.resetTransform();
    context.translate(oX, oY);
    context.scale(this.scale, this.scale);
    context.rotate(canUtil.toRadian(this.angle));
    context.translate(-oX, -oY);
    context.fillRect(oX-150,oY-150,300,300);
     context.resetTransform();
     if(selectedBox){
    }
  }
  showContent(){
    context.fillStyle='black';
    context.fillText(selectedBox.index, oX, oY);
    
  }
}