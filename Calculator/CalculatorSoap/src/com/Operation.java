package com;
import javax.jws.WebService;

@WebService
public class Operation {
	
	public float add(float value1,float value2){
		
		System.out.println("productdetail() function called");
		return value1 + value2;
	}

	public float sub(float value1,float value2){
		System.out.println("sub() function called");

		return value1 - value2;
	}
	public float mul(float value1,float value2){
		System.out.println("mul() function called");

		return value1 * value2;
	}

	public float div(float value1,float value2){
		System.out.println("div() function called");

		if(value2==0)
			return 0;
		else
			return value1/value2;
	}
	
}
