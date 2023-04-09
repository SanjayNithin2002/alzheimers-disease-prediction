import tensorflow
import numpy as np
import sys
from tensorflow.keras.preprocessing.image import load_img, img_to_array

class_dict = {0: 'Mild Demented', 1: 'Moderate Demented', 2: 'Non Demented', 3: 'Very Mild Demented'}
model = tensorflow.keras.models.load_model('model_1.h5')

img = load_img(sys.argv[1], target_size = (224,224,3))
img = img_to_array(img)
img = img/255

img = np.expand_dims(img,axis=0)
predict_x=model.predict(img) 
answer=np.argmax(predict_x,axis=1)


prob = np.round((predict_x*100),2).tolist()[0]
prob = [round(i) for i in prob]
print(class_dict[0])
print(str(prob[0]))
print(class_dict[1])
print(str(prob[1]))
print(class_dict[2])
print(str(prob[2]))
print(class_dict[3])
print(str(prob[3]))
print(class_dict[answer[0]])
