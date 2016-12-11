package com.ebay;

import javax.jws.WebService;
import java.sql.*;

import org.json.JSONArray;

import org.json.JSONObject;


@WebService
public class Product 
{
	String dbUrl = "jdbc:mysql://localhost:3306/ebaydb";
	public String loadProducts(int userid)
	{
		JSONArray result=new JSONArray();
		try
		{
			System.out.println("In load products");
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection (dbUrl, "root", "root");
			PreparedStatement stmt = conn.prepareStatement("select * from products where seller_id<> ? and quantity>0 order by product_id desc");
			stmt.setInt(1,userid);
			ResultSet rs=stmt.executeQuery();
			ResultSetMetaData rsmd= rs.getMetaData();
			while(rs.next())
			{
				JSONObject row=new JSONObject();
				for(int i=0;i<rsmd.getColumnCount();i++)
				{
					
					row.put(rsmd.getColumnName(i+1), rs.getObject(i+1));
				}
				result.put(row);
			}
		}
		catch(Exception e)
		{
			System.out.println(e);
			
			return "{'StatusCode'=401,'err'="+e.getMessage()+"}";
		}
		System.out.println(result.toString());
		return result.toString();
				
	}
	public String loadProductDetails(String productId)
	{
		System.out.println("in product details:"+productId);
		JSONArray resArray=new JSONArray();
		try
		{
			Class.forName("com.mysql.jdbc.Driver");
			Connection conn = DriverManager.getConnection (dbUrl, "root", "root");
			PreparedStatement stmt = conn.prepareStatement("SELECT p.product_id,p.product_name,p.quantity,p.description,p.price,p.seller_id,p.isBidProduct,u.username,u.address " +
            "FROM ebaydb.products p,ebaydb.users u where p.seller_id=u.userid and product_id=?");
			stmt.setInt(1,Integer.parseInt(productId));
			ResultSet rs=stmt.executeQuery();
			ResultSetMetaData rsmd=rs.getMetaData();
			if(rs.next())
			{
				JSONObject obj=new JSONObject();
				for(int i=0;i<rsmd.getColumnCount();i++)
				{
					obj.accumulate(rsmd.getColumnName(i+1), rs.getObject(i+1));
				}
				resArray.put(obj);
				System.out.println(resArray);
			}
			else
			{
				resArray.put("");
			}
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		return resArray.toString();
	}
}
