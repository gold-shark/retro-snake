# retro-snake #

## **类** Snake ##

> ### 属性 ###
  - x *X坐标*
  - y *Y坐标*
  - leg *长度*
  - speed *速度*
  - direction *方向*
  - points *点集*
  - integral *积分*
  - isOver *是否结束*

> ### 方法 ###
  - action (point, border)  *向前爬行*
  - isEat (point) *是否吃到点*
  - isBite (point) *是否咬到自己*
  - isToBoundary (point, border) *是否撞到墙*
  - init () *初始化*

## **类** point ##

> ### 属性 ###
  - x *X坐标*
  - y *Y坐标*
  - isExist *是否存在*
